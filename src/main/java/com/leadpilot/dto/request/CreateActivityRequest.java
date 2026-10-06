package com.leadpilot.dto.request;

import com.leadpilot.entity.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateActivityRequest {

    @NotNull
    private ActivityType type;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotNull
    private LocalDateTime activityDate;

    @NotNull
    private Long leadId;
}