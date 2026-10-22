package com.leadpilot.service;

import com.leadpilot.event.LeadChangedEvent;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * Runs after the CRUD transaction has committed, on a background thread.
 * So saving a lead stays fast, and a failed embedding never breaks the save.
 */
@Component
@RequiredArgsConstructor
public class LeadIndexListener {

    private static final Logger log = LoggerFactory.getLogger(LeadIndexListener.class);

    private final LeadIndexService leadIndexService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onLeadChanged(LeadChangedEvent event) {
        try {
            leadIndexService.reindexLead(event.leadId());
        } catch (Exception e) {
            log.warn("Could not index lead {}: {}", event.leadId(), e.getMessage());
        }
    }
}