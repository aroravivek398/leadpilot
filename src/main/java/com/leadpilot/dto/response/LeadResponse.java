package com.leadpilot.dto.response;

import com.leadpilot.entity.LeadSource;
import com.leadpilot.entity.LeadStage;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class LeadResponse {

    private Long id;
    private String name;
    private LeadSource source;
    private LeadStage stage;
    private BigDecimal estimatedValue;
    private String notes;

    private Long companyId;
    private String companyName;

    private Long contactId;
    private String contactName;

    private Long assignedUserId;
    private String assignedUserName;
}