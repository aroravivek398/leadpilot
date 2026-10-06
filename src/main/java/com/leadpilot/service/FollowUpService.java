package com.leadpilot.service;

import com.leadpilot.dto.request.CreateFollowUpRequest;
import com.leadpilot.dto.request.UpdateFollowUpRequest;
import com.leadpilot.dto.response.FollowUpResponse;
import com.leadpilot.entity.FollowUp;
import com.leadpilot.entity.FollowUpStatus;
import com.leadpilot.entity.Lead;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.FollowUpRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FollowUpService {

    private final FollowUpRepository followUpRepository;
    private final LeadRepository leadRepository;

    public FollowUpResponse createFollowUp(CreateFollowUpRequest request) {

        Lead lead = leadRepository.findById(request.getLeadId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lead not found with id: " + request.getLeadId()
                        )
                );

        FollowUp followUp = new FollowUp();
        followUp.setTitle(request.getTitle());
        followUp.setDescription(request.getDescription());
        followUp.setDueDate(request.getDueDate());
        followUp.setLead(lead);

        FollowUp savedFollowUp = followUpRepository.save(followUp);

        return toResponse(savedFollowUp);
    }

    @Transactional(readOnly = true)
    public FollowUpResponse getFollowUp(Long id) {

        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FollowUp not found with id: " + id
                        )
                );

        return toResponse(followUp);
    }

    @Transactional(readOnly = true)
    public List<FollowUpResponse> getAllFollowUps() {

        return followUpRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FollowUpResponse> getFollowUpsByLead(Long leadId) {

        if (!leadRepository.existsById(leadId)) {
            throw new ResourceNotFoundException(
                    "Lead not found with id: " + leadId
            );
        }

        return followUpRepository.findByLeadIdOrderByDueDateAsc(leadId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FollowUpResponse updateFollowUp(
            Long id,
            UpdateFollowUpRequest request
    ) {

        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FollowUp not found with id: " + id
                        )
                );

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

        return toResponse(followUp);
    }

    public void deleteFollowUp(Long id) {

        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FollowUp not found with id: " + id
                        )
                );

        followUpRepository.delete(followUp);
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
}