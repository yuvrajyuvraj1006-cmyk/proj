package com.skyways.notification.controller;

import com.skyways.notification.dto.BookingConfirmationDto;
import com.skyways.notification.retry.NotificationRetryHandler;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private static final Logger log = LogManager.getLogger(NotificationController.class);

    private final NotificationRetryHandler retryHandler;

    public NotificationController(NotificationRetryHandler retryHandler) {
        this.retryHandler = retryHandler;
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> sendConfirmation(@RequestBody Map<String, String> payload) {
        try {
            BookingConfirmationDto dto = BookingConfirmationDto.builder()
                .bookingRef(payload.get("bookingRef"))
                .passengerEmail(payload.get("passengerEmail"))
                .passengerName(payload.getOrDefault("passengerName", "Valued Customer"))
                .flightNumber(payload.getOrDefault("flightNumber", ""))
                .originCity(payload.getOrDefault("originIata", ""))
                .destinationCity(payload.getOrDefault("destinationIata", ""))
                .departureTime(payload.getOrDefault("departureTime", ""))
                .arrivalTime(payload.getOrDefault("arrivalTime", ""))
                .totalAmount(new BigDecimal(payload.getOrDefault("totalAmount", "0")))
                .currency(payload.getOrDefault("currency", "INR"))
                .eventType("CONFIRMED")
                .build();

            retryHandler.sendWithRetry(dto);
            log.info("Confirmation email sent directly [bookingRef={}, email={}]",
                payload.get("bookingRef"), payload.get("passengerEmail"));
        } catch (Exception e) {
            log.error("Failed to send confirmation email [bookingRef={}]: {}",
                payload.get("bookingRef"), e.getMessage());
        }
        return ResponseEntity.ok().build();
    }
}
