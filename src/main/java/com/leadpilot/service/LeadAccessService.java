package com.leadpilot.service;

import com.leadpilot.entity.Lead;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LeadAccessService {

    private final LeadRepository leadRepository;
    private final CurrentUserService currentUserService;

    public Lead getOwnedLead(Long leadId) {
        Long userId = currentUserService.getCurrentUser().getId();

        return leadRepository.findById(leadId)
                .filter(lead -> lead.getAssignedUser().getId().equals(userId))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lead not found with id: " + leadId)
                );
    }
}