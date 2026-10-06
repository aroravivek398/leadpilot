package com.leadpilot.dto.response;

import com.leadpilot.entity.ActivityType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ActivityResponse {

    private Long id;
    private ActivityType type;
    private String description;
    private LocalDateTime activityDate;
    private Long leadId;
}