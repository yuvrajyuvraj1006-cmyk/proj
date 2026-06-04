package com.skyways.booking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateBookingRequest {

    @NotNull
    private UUID flightId;

    @NotNull
    private BigDecimal totalAmount;

    private String currency = "INR";

    private String cabinClass = "ECONOMY";

    private String contactEmail;

    private String contactPhone;

    private String flightNumber;
    private String airlineName;
    private String originIata;
    private String destinationIata;
    private String departureTime;
    private String arrivalTime;

    @NotEmpty
    @Valid
    private List<PassengerDto> passengers;
}
