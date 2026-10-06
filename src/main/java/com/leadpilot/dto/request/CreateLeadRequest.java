package com.leadpilot.dto.request;

import com.leadpilot.entity.LeadSource;
import com.leadpilot.entity.LeadStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateLeadRequest {

    @NotBlank
    @Size(max = 150)
    private String name;

    @NotNull
    private LeadSource source;

    @NotNull
    private LeadStage stage;

    private BigDecimal estimatedValue;

    @Size(max = 1000)
    private String notes;

    @NotNull
    private Long companyId;

    @NotNull
    private Long contactId;

    @NotNull
    private Long assignedUserId;
}