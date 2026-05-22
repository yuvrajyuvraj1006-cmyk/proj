package com.skyways.booking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingSummaryDto {
    private String bookingId;
    private String bookingRef;
    private String status;
    private String totalAmount;
    private String currency;
    private int passengerCount;
    private String createdAt;
}
