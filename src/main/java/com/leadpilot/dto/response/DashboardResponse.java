package com.leadpilot.dto.response;

import com.leadpilot.entity.LeadStage;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@AllArgsConstructor
public class DashboardResponse {

    private Long totalLeads;

    private Map<LeadStage, Long> stageCounts;

    private Long totalFollowUps;

    private Long pendingFollowUps;

    private Long completedFollowUps;

    private Long overdueFollowUps;

    private BigDecimal totalPipelineValue;

    private BigDecimal wonValue;

    private BigDecimal lostValue;
}