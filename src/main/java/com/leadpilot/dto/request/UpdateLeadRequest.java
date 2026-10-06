package com.leadpilot.dto.request;

import com.leadpilot.entity.LeadSource;
import com.leadpilot.entity.LeadStage;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class UpdateLeadRequest {

    @Size(max = 150)
    private String name;

    private LeadSource source;

    private LeadStage stage;

    private BigDecimal estimatedValue;

    @Size(max = 1000)
    private String notes;

    private Long companyId;

    private Long contactId;

    private Long assignedUserId;
}