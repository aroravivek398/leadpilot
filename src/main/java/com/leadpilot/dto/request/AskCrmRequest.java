package com.leadpilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AskCrmRequest(
        @NotBlank @Size(max = 500) String question
) {
}