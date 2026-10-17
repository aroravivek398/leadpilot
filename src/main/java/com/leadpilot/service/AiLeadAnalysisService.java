package com.leadpilot.service;

import com.leadpilot.dto.response.AiLeadAnalysisResponse;
import com.leadpilot.entity.Activity;
import com.leadpilot.entity.FollowUp;
import com.leadpilot.entity.Lead;
import com.leadpilot.exception.AiServiceException;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.ActivityRepository;
import com.leadpilot.repository.FollowUpRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiLeadAnalysisService {
    private final ChatClient chatClient;
    private final LeadRepository leadRepository;
    private final ActivityRepository activityRepository;
    private final FollowUpRepository followUpRepository;

    @Transactional(readOnly = true)
    public AiLeadAnalysisResponse analyzeLead(Long leadId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lead not found with id: " + leadId
                        )
                );

        List<Activity> activities =
                activityRepository.findByLeadIdOrderByActivityDateDesc(leadId);

        List<FollowUp> followUps =
                followUpRepository.findByLeadIdOrderByDueDateAsc(leadId);

        String prompt = buildPrompt(lead, activities, followUps);


        try {
            return chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .entity(
                            AiLeadAnalysisResponse.class,
                            spec -> spec.validateSchema()
                    );
        } catch (Exception e) {
            throw new AiServiceException("AI analysis failed", e);
        }
    }

    private String buildPrompt(
            Lead lead,
            List<Activity> activities,
            List<FollowUp> followUps
    ) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are an AI sales assistant inside a CRM.

                Analyze the following lead using ONLY the information provided.

                Return a concise and practical sales analysis.

                Lead information:
                """);

        prompt.append("\nLead name: ").append(lead.getName());
        prompt.append("\nCompany: ").append(lead.getCompany().getName());
        prompt.append("\nContact: ").append(lead.getContact().getName());
        prompt.append("\nContact email: ").append(lead.getContact().getEmail());
        prompt.append("\nStage: ").append(lead.getStage());
        prompt.append("\nSource: ").append(lead.getSource());
        prompt.append("\nEstimated value: INR ").append(lead.getEstimatedValue());        prompt.append("\nNotes: ").append(lead.getNotes());
        prompt.append("\nAll monetary amounts are in Indian Rupees (INR). Never use the dollar sign.");
        prompt.append("\n\nHistorical activities:");

        if (activities.isEmpty()) {
            prompt.append("\nNo activities recorded.");
        } else {
            for (Activity activity : activities) {
                prompt.append("\n- ")
                        .append(activity.getType())
                        .append(" | ")
                        .append(activity.getActivityDate())
                        .append(" | ")
                        .append(activity.getDescription());
            }
        }

        prompt.append("\n\nFollow-ups:");

        if (followUps.isEmpty()) {
            prompt.append("\nNo follow-ups recorded.");
        } else {
            for (FollowUp followUp : followUps) {
                prompt.append("\n- ")
                        .append(followUp.getTitle())
                        .append(" | ")
                        .append(followUp.getDueDate())
                        .append(" | ")
                        .append(followUp.getStatus())
                        .append(" | ")
                        .append(followUp.getDescription());
            }

        }

        prompt.append(
"""
 Based on this information, provide:

1. A concise summary of the lead.
2. Their likely interests and concerns based only on the provided data.
3. The next best action, strictly considering the lead's current stage.
4. A personalized follow-up message appropriate for the lead's current stage.

Stage-specific guidance:

- NEW:
  Focus on initial outreach and understanding the prospect's needs.

- CONTACTED:
  Focus on continuing the conversation, qualification, and identifying blockers.

- INTERESTED:
  Focus on addressing concerns, answering questions, and moving the prospect toward a proposal or decision.

- PROPOSAL:
  Focus on proposal follow-up, resolving objections, negotiation, and helping the prospect make a decision.

- WON:
  Do not suggest actions intended to close the sale.
  Focus on onboarding, implementation, relationship management, or next steps after the sale.

- LOST:
  Do not suggest actions intended to immediately close the existing opportunity.
  Focus on understanding the reason for loss and possible future re-engagement when appropriate.

Never recommend moving a WON lead toward closing again.
Never recommend treating a LOST lead as an active sales opportunity unless the CRM data explicitly indicates re-engagement.

Do not invent facts that are not present in the CRM data.
                """);

        return prompt.toString();
    }
}