package com.leadpilot.service;

import com.leadpilot.entity.Activity;
import com.leadpilot.entity.FollowUp;
import com.leadpilot.entity.Lead;
import com.leadpilot.repository.ActivityRepository;
import com.leadpilot.repository.FollowUpRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Turns one lead (plus its activities and follow-ups) into small text chunks.
 * One chunk = one fact-sized piece of text, so a search can return just the relevant piece.
 * Every chunk repeats the lead and company name so it still makes sense on its own.
 */
@Component
@RequiredArgsConstructor
public class LeadDocumentBuilder {

    private final LeadRepository leadRepository;
    private final ActivityRepository activityRepository;
    private final FollowUpRepository followUpRepository;

    @Transactional(readOnly = true)
    public List<Document> build(Long leadId) {
        return leadRepository.findById(leadId)
                .map(this::buildFor)
                .orElse(List.of());
    }

    private List<Document> buildFor(Lead lead) {
        String label = "Lead \"" + lead.getName() + "\" (company " + lead.getCompany().getName() + ")";
        List<Document> documents = new ArrayList<>();

        documents.add(new Document(
                label + ". Stage: " + lead.getStage()
                        + ". Source: " + lead.getSource()
                        + ". Estimated value: INR " + lead.getEstimatedValue()
                        + ". Contact: " + lead.getContact().getName()
                        + ". Assigned to: " + lead.getAssignedUser().getName()
                        + ". Notes: " + orNone(lead.getNotes()),
                metadata(lead, "LEAD")
        ));

        for (Activity activity : activityRepository.findByLeadIdOrderByActivityDateDesc(lead.getId())) {
            documents.add(new Document(
                    label + ". Activity: " + activity.getType()
                            + " on " + activity.getActivityDate()
                            + ". " + activity.getDescription(),
                    metadata(lead, "ACTIVITY")
            ));
        }

        for (FollowUp followUp : followUpRepository.findByLeadIdOrderByDueDateAsc(lead.getId())) {
            documents.add(new Document(
                    label + ". Follow-up: " + followUp.getTitle()
                            + ", due " + followUp.getDueDate()
                            + ", status " + followUp.getStatus()
                            + ". " + orNone(followUp.getDescription()),
                    metadata(lead, "FOLLOW_UP")
            ));
        }

        return documents;
    }

    /** ownerId is what keeps one user's data away from another user's questions. */
    private Map<String, Object> metadata(Lead lead, String type) {
        return Map.of(
                "leadId", lead.getId(),
                "leadName", lead.getName(),
                "ownerId", lead.getAssignedUser().getId(),
                "type", type
        );
    }

    private String orNone(String value) {
        return (value == null || value.isBlank()) ? "none" : value;
    }
}