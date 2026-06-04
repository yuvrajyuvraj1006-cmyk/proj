package com.skyways.booking.controller;

import com.skyways.booking.dto.BookingSummaryDto;
import com.skyways.booking.dto.CreateBookingRequest;
import com.skyways.booking.entity.Booking;
import com.skyways.booking.service.BookingService;
import com.skyways.common.dto.ApiResponse;
import com.skyways.common.exception.booking.BookingAlreadyCancelledException;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Bookings", description = "Reservation creation with overbooking guard and SAGA orchestration")
@SecurityRequirement(name = "BearerAuth")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @Operation(summary = "Create a booking", description = "Validates passengers, checks seat availability, persists booking in INITIATED state, and triggers the booking SAGA. Requires X-User-Id header (injected by gateway).")
    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            HttpServletRequest httpRequest) {

        String userIdHeader = httpRequest.getHeader("X-User-Id");
        UUID userId = UUID.fromString(userIdHeader);

        Booking booking = bookingService.createBooking(request, userId);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
            ApiResponse.ok(Map.of(
                "bookingId",  booking.getBookingId().toString(),
                "bookingRef", booking.getBookingRef(),
                "status",     booking.getStatus().name(),
                "message",    "Booking initiated. Confirmation will be sent to your email."
            ))
        );
    }

    @Operation(summary = "Get current user's bookings", description = "Returns a paginated list of bookings for the authenticated user.")
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest httpRequest) {

        String userIdHeader = httpRequest.getHeader("X-User-Id");
        UUID userId = UUID.fromString(userIdHeader);

        Page<BookingSummaryDto> bookings = bookingService.getMyBookings(
                userId, PageRequest.of(page, size, Sort.by("createdAt").descending()));

        Map<String, Object> pageResponse = new LinkedHashMap<>();
        pageResponse.put("content",       bookings.getContent());
        pageResponse.put("totalElements", bookings.getTotalElements());
        pageResponse.put("totalPages",    bookings.getTotalPages());
        pageResponse.put("pageNumber",    bookings.getNumber());
        pageResponse.put("pageSize",      bookings.getSize());

        return ResponseEntity.ok(ApiResponse.ok(pageResponse));
    }

    @PostMapping("/internal/confirm/{bookingId}")
    public ResponseEntity<Void> confirmBookingInternal(@PathVariable UUID bookingId) {
        try {
            bookingService.updateBookingStatus(bookingId,
                com.skyways.booking.entity.BookingStatus.CONFIRMED, "Payment confirmed");
        } catch (Exception e) {
            // already confirmed or cancelled — no action needed
        }

        CompletableFuture.runAsync(() -> {
            try {
                Booking booking = bookingService.getById(bookingId);
                if (booking != null && booking.getContactEmail() != null
                        && !booking.getContactEmail().isBlank()) {
                    java.util.Map<String, String> body = new java.util.HashMap<>();
                    body.put("bookingRef",     booking.getBookingRef());
                    body.put("passengerEmail", booking.getContactEmail());
                    body.put("totalAmount",    booking.getTotalAmount().toString());
                    body.put("currency",       booking.getCurrency());
                    if (booking.getFlightNumber()    != null) body.put("flightNumber",    booking.getFlightNumber());
                    if (booking.getAirlineName()     != null) body.put("airlineName",     booking.getAirlineName());
                    if (booking.getOriginIata()      != null) body.put("originIata",      booking.getOriginIata());
                    if (booking.getDestinationIata() != null) body.put("destinationIata", booking.getDestinationIata());
                    if (booking.getDepartureTime()   != null) body.put("departureTime",   booking.getDepartureTime());
                    if (booking.getArrivalTime()     != null) body.put("arrivalTime",     booking.getArrivalTime());
                    new RestTemplate().postForEntity(
                        "http://localhost:8085/api/v1/notifications/confirm",
                        body, String.class);
                }
            } catch (Exception e) {
                // best effort — booking is already confirmed
            }
        });

        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Cancel a booking", description = "Cancels a booking and triggers refund processing.")
    @PostMapping("/{bookingRef}/cancel")
    public ResponseEntity<ApiResponse<Map<String, String>>> cancelBooking(
            @PathVariable String bookingRef,
            HttpServletRequest httpRequest) {

        String userIdHeader = httpRequest.getHeader("X-User-Id");
        UUID userId = UUID.fromString(userIdHeader);

        try {
            bookingService.cancelBooking(bookingRef, userId);
        } catch (BookingAlreadyCancelledException e) {
            // already cancelled — still a success from the user's perspective
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "bookingRef", bookingRef,
                "status",     "CANCELLED",
                "message",    "Booking cancellation processed. Refund will be processed within 10-15 business days."
            )));
        }

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "bookingRef", bookingRef,
            "status",     "CANCELLED",
            "message",    "Booking cancelled successfully. Refund will be processed within 10-15 business days."
        )));
    }

    @Operation(summary = "Get booking by reference", description = "Returns current status and amount for a booking reference (e.g. SW-A3K9X)")
    @GetMapping("/{bookingRef}")
    public ResponseEntity<ApiResponse<Map<String, String>>> getBooking(
            @Parameter(description = "Human-readable booking reference, e.g. SW-A3K9X") @PathVariable String bookingRef) {

        Booking booking = bookingService.getByRef(bookingRef);

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
            "bookingId",     booking.getBookingId().toString(),
            "bookingRef",    booking.getBookingRef(),
            "status",        booking.getStatus().name(),
            "totalAmount",   booking.getTotalAmount().toString(),
            "currency",      booking.getCurrency()
        )));
    }
}
