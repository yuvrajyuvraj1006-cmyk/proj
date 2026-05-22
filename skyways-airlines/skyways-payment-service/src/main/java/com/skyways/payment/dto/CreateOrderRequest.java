package com.skyways.payment.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateOrderRequest {
    private UUID bookingId;
    private BigDecimal amount;
    private String currency;
}
