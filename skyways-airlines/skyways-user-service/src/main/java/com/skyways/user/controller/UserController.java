package com.skyways.user.controller;

import com.skyways.common.dto.ApiResponse;
import com.skyways.user.dto.UpdateProfileRequest;
import com.skyways.user.dto.UserProfileResponse;
import com.skyways.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getHeader("X-User-Id"));
        return ResponseEntity.ok(ApiResponse.ok(userService.getProfile(userId)));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @RequestBody UpdateProfileRequest body,
            HttpServletRequest request) {
        UUID userId = UUID.fromString(request.getHeader("X-User-Id"));
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(userId, body)));
    }
}
