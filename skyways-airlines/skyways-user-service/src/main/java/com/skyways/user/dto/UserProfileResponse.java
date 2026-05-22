package com.skyways.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String createdAt;
}
