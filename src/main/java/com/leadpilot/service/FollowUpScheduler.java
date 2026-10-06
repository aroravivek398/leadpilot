package com.leadpilot.service;

import com.leadpilot.entity.FollowUp;
import com.leadpilot.entity.FollowUpStatus;
import com.leadpilot.repository.FollowUpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class FollowUpScheduler {

    private final FollowUpRepository followUpRepository;

    @Scheduled(fixedRate = 60000)
    public void markOverdueFollowUps() {

        LocalDateTime now = LocalDateTime.now();

        followUpRepository.findAll()
                .stream()
                .filter(followUp ->
                        followUp.getStatus() == FollowUpStatus.PENDING
                                && followUp.getDueDate().isBefore(now)
                )
                .forEach(followUp -> {
                    followUp.setStatus(FollowUpStatus.OVERDUE);
                    followUpRepository.save(followUp);
                });
    }
}