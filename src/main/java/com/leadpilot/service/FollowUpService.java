package com.leadpilot.service;

import com.leadpilot.dto.request.CreateFollowUpRequest;
import com.leadpilot.dto.request.UpdateFollowUpRequest;
import com.leadpilot.dto.response.FollowUpResponse;
import com.leadpilot.entity.FollowUp;
import com.leadpilot.entity.Lead;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.FollowUpRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.leadpilot.event.LeadChangedEvent;
import org.springframework.context.ApplicationEventPublisher;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;
    private final LeadAccessService leadAccessService;
    private final CurrentUserService currentUserService;
    private final ApplicationEventPublisher eventPublisher;

    public FollowUpResponse createFollowUp(CreateFollowUpRequest request) {

        Lead lead = leadAccessService.getOwnedLead(request.getLeadId());

        FollowUp followUp = new FollowUp();
        followUp.setTitle(request.getTitle());
        followUp.setDescription(request.getDescription());
        followUp.setDueDate(request.getDueDate());
        followUp.setLead(lead);

        FollowUp savedFollowUp = followUpRepository.save(followUp);
        eventPublisher.publishEvent(new LeadChangedEvent(lead.getId()));

        return toResponse(savedFollowUp);
    }

    @Transactional(readOnly = true)
    public FollowUpResponse getFollowUp(Long id) {

        FollowUp followUp = getOwnedFollowUp(id);

        return toResponse(followUp);
    }

    @Transactional(readOnly = true)
    public List<FollowUpResponse> getAllFollowUps() {
        Long userId = currentUserService.getCurrentUser().getId();

        return followUpRepository.findAll()
                .stream()
                .filter(f -> f.getLead().getAssignedUser().getId().equals(userId))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FollowUpResponse> getFollowUpsByLead(Long leadId) {

        leadAccessService.getOwnedLead(leadId);

        return followUpRepository.findByLeadIdOrderByDueDateAsc(leadId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FollowUpResponse updateFollowUp(
            Long id,
            UpdateFollowUpRequest request
    ) {

        FollowUp followUp = getOwnedFollowUp(id);

        if (request.getTitle() != null) {
            followUp.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            followUp.setDescription(request.getDescription());
        }

        if (request.getDueDate() != null) {
            followUp.setDueDate(request.getDueDate());
        }

        if (request.getStatus() != null) {
            followUp.setStatus(request.getStatus());
        }

        eventPublisher.publishEvent(new LeadChangedEvent(followUp.getLead().getId()));

        return toResponse(followUp);
    }

    public void deleteFollowUp(Long id) {

        FollowUp followUp = getOwnedFollowUp(id);
        Long leadId = followUp.getLead().getId();
        followUpRepository.delete(followUp);
        eventPublisher.publishEvent(new LeadChangedEvent(leadId));
    }

    private FollowUpResponse toResponse(FollowUp followUp) {

        return new FollowUpResponse(
                followUp.getId(),
                followUp.getTitle(),
                followUp.getDescription(),
                followUp.getDueDate(),
                followUp.getStatus(),
                followUp.getLead().getId()
        );
    }

    private FollowUp getOwnedFollowUp(Long id) {
        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("FollowUp not found with id: " + id));
        leadAccessService.getOwnedLead(followUp.getLead().getId());
        return followUp;
    }
}