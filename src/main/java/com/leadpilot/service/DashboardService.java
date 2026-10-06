package com.leadpilot.service;

import com.leadpilot.entity.LeadStage;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.leadpilot.repository.FollowUpRepository;
import com.leadpilot.dto.response.DashboardResponse;
import com.leadpilot.entity.FollowUpStatus;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;
    private final FollowUpRepository followUpRepository;

    public DashboardResponse getDashboard() {

        Map<LeadStage, Long> stageCounts = new EnumMap<>(LeadStage.class);

        for (LeadStage stage : LeadStage.values()) {
            stageCounts.put(stage, 0L);
        }

        List<Object[]> leadResults = leadRepository.countLeadsByStage();

        for (Object[] result : leadResults) {
            LeadStage stage = (LeadStage) result[0];
            Long count = (Long) result[1];

            stageCounts.put(stage, count);
        }

        Long totalLeads = leadRepository.count();

        long pendingFollowUps = 0;
        long overdueFollowUps = 0;
        long completedFollowUps = 0;

        List<Object[]> followUpResults =
                followUpRepository.countFollowUpsByCompletion();

        for (Object[] result : followUpResults) {

            FollowUpStatus status = (FollowUpStatus) result[0];
            Long count = (Long) result[1];

            if (status == FollowUpStatus.PENDING) {
                pendingFollowUps = count;
            } else if (status == FollowUpStatus.OVERDUE) {
                overdueFollowUps = count;
            } else if (status == FollowUpStatus.COMPLETED) {
                completedFollowUps = count;
            }
        }

        long totalFollowUps =
                pendingFollowUps + overdueFollowUps + completedFollowUps;
        BigDecimal totalPipelineValue = BigDecimal.ZERO;
        BigDecimal wonValue = BigDecimal.ZERO;
        BigDecimal lostValue = BigDecimal.ZERO;

        List<Object[]> valueResults = leadRepository.sumLeadValueByStage();

        for (Object[] result : valueResults) {
            LeadStage stage = (LeadStage) result[0];
            BigDecimal value = (BigDecimal) result[1];

            if (stage == LeadStage.WON) {
                wonValue = value;
            } else if (stage == LeadStage.LOST) {
                lostValue = value;
            } else {
                totalPipelineValue = totalPipelineValue.add(value);
            }
        }

        return new DashboardResponse(
                totalLeads,
                stageCounts,
                totalFollowUps,
                pendingFollowUps,
                overdueFollowUps,
                completedFollowUps,
                totalPipelineValue,
                wonValue,
                lostValue
        );
    }
}