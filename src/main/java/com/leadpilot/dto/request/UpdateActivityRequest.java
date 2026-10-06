package com.leadpilot.dto.request;

import com.leadpilot.entity.ActivityType;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateActivityRequest {

    private ActivityType type;

    @Size(max = 1000)
    private String description;

    private LocalDateTime activityDate;
}