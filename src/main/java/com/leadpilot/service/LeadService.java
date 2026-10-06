package com.leadpilot.service;

import com.leadpilot.dto.request.CreateLeadRequest;
import com.leadpilot.dto.request.UpdateLeadRequest;
import com.leadpilot.dto.response.LeadResponse;
import com.leadpilot.entity.Company;
import com.leadpilot.entity.Contact;
import com.leadpilot.entity.Lead;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.CompanyRepository;
import com.leadpilot.repository.ContactRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.leadpilot.entity.User;
import com.leadpilot.repository.UserRepository;
import com.leadpilot.repository.ActivityRepository;
import com.leadpilot.repository.FollowUpRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final FollowUpRepository followUpRepository;



    public LeadResponse createLead(CreateLeadRequest request) {

        Company company = getCompany(request.getCompanyId());
        Contact contact = getContact(request.getContactId());

        validateContactBelongsToCompany(contact, company);
        User assignedUser = getUser(request.getAssignedUserId());

        Lead lead = new Lead();
        lead.setName(request.getName());
        lead.setSource(request.getSource());
        lead.setStage(request.getStage());
        lead.setEstimatedValue(request.getEstimatedValue());
        lead.setNotes(request.getNotes());
        lead.setCompany(company);
        lead.setContact(contact);
        lead.setAssignedUser(assignedUser);

        return toResponse(leadRepository.save(lead));
    }

    public LeadResponse getLead(Long id) {
        return toResponse(getLeadById(id));
    }

    public List<LeadResponse> getAllLeads() {
        return leadRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<LeadResponse> getLeadsByCompany(Long companyId) {
        getCompany(companyId);

        return leadRepository.findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<LeadResponse> getLeadsByContact(Long contactId) {
        getContact(contactId);

        return leadRepository.findByContactId(contactId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public LeadResponse updateLead(Long id, UpdateLeadRequest request) {

        Lead lead = getLeadById(id);

        if (request.getName() != null) {
            lead.setName(request.getName());
        }

        if (request.getSource() != null) {
            lead.setSource(request.getSource());
        }

        if (request.getStage() != null) {
            lead.setStage(request.getStage());
        }

        if (request.getEstimatedValue() != null) {
            lead.setEstimatedValue(request.getEstimatedValue());
        }

        if (request.getNotes() != null) {
            lead.setNotes(request.getNotes());
        }

        Company company = lead.getCompany();
        Contact contact = lead.getContact();

        if (request.getCompanyId() != null) {
            company = getCompany(request.getCompanyId());
        }

        if (request.getContactId() != null) {
            contact = getContact(request.getContactId());
        }
        if (request.getAssignedUserId() != null) {
            User assignedUser = getUser(request.getAssignedUserId());
            lead.setAssignedUser(assignedUser);
        }

        validateContactBelongsToCompany(contact, company);

        lead.setCompany(company);
        lead.setContact(contact);

        return toResponse(leadRepository.save(lead));
    }

    public void deleteLead(Long id) {
        Lead lead = getLeadById(id);

        activityRepository.deleteByLeadId(id);
        followUpRepository.deleteByLeadId(id);

        leadRepository.delete(lead);
    }

    private Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Lead not found with id: " + id)
                );
    }

    private Company getCompany(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Company not found with id: " + id)
                );
    }

    private Contact getContact(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Contact not found with id: " + id)
                );
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        )
                );
    }

    private void validateContactBelongsToCompany(
            Contact contact,
            Company company
    ) {
        if (!contact.getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException(
                    "Contact does not belong to the selected company"
            );
        }
    }

    private LeadResponse toResponse(Lead lead) {
        return new LeadResponse(
                lead.getId(),
                lead.getName(),
                lead.getSource(),
                lead.getStage(),
                lead.getEstimatedValue(),
                lead.getNotes(),
                lead.getCompany().getId(),
                lead.getCompany().getName(),
                lead.getContact().getId(),
                lead.getContact().getName(),
                lead.getAssignedUser().getId(),
                lead.getAssignedUser().getName()
        );
    }
}