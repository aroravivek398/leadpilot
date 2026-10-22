package com.leadpilot.service;

import com.leadpilot.entity.Lead;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Keeps the vector store in sync with the CRM tables.
 * Strategy: delete everything stored for the lead, then add fresh chunks (simple and always correct).
 * Not wrapped in a database transaction on purpose: the chunks are read in LeadDocumentBuilder
 * (read-only transaction) and written to the vector store afterwards.
 */
@Service
@RequiredArgsConstructor
public class LeadIndexService {

    private static final Logger log = LoggerFactory.getLogger(LeadIndexService.class);

    private final VectorStore vectorStore;
    private final LeadDocumentBuilder documentBuilder;
    private final LeadRepository leadRepository;

    public void reindexLead(Long leadId) {
        List<Document> documents = documentBuilder.build(leadId);

        Filter.Expression forThisLead = new FilterExpressionBuilder().eq("leadId", leadId).build();
        vectorStore.delete(forThisLead);

        if (!documents.isEmpty()) {
            vectorStore.add(documents);
        }
    }

    /** Re-indexes all leads owned by the user. Returns how many leads were indexed. */
    public int reindexAllForUser(Long userId) {
        List<Lead> leads = leadRepository.findByAssignedUserId(userId);
        for (Lead lead : leads) {
            reindexLead(lead.getId());
        }
        log.info("Re-indexed {} leads for user {}", leads.size(), userId);
        return leads.size();
    }
}