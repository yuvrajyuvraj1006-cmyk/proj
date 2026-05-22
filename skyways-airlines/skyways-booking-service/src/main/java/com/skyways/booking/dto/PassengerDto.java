package com.skyways.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PassengerDto {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String passportNumber;

    private String passportExpiry;

    @NotBlank
    private String nationality;

    @NotBlank
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date of birth must be YYYY-MM-DD")
    private String dateOfBirth;

    private String email;

    private String phone;
}
