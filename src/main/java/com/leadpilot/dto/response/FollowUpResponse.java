package com.leadpilot.dto.response;

import com.leadpilot.entity.FollowUpStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class FollowUpResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private FollowUpStatus status;
    private Long leadId;
}