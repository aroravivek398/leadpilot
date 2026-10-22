package com.leadpilot.service;

import com.leadpilot.entity.FollowUpStatus;
import com.leadpilot.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class FollowUpScheduler {

    private final FollowUpRepository followUpRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void markOverdueFollowUps() {
        followUpRepository.markOverdue(
                FollowUpStatus.PENDING,
                FollowUpStatus.OVERDUE,
                LocalDateTime.now()
        );
    }
}