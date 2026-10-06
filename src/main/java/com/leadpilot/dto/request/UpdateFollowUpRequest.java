package com.leadpilot.dto.request;

import com.leadpilot.entity.FollowUpStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UpdateFollowUpRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 1000)
    private String description;

    private LocalDateTime dueDate;

    private FollowUpStatus status;
}