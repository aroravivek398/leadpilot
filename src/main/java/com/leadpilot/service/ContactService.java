package com.leadpilot.service;

import com.leadpilot.dto.request.CreateContactRequest;
import com.leadpilot.dto.request.UpdateContactRequest;
import com.leadpilot.dto.response.ContactResponse;
import com.leadpilot.entity.Company;
import com.leadpilot.entity.Contact;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.CompanyRepository;
import com.leadpilot.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;

    public ContactResponse createContact(CreateContactRequest request) {

        Company company = getCompany(request.getCompanyId());

        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setDesignation(request.getDesignation());
        contact.setCompany(company);

        return toResponse(contactRepository.save(contact));
    }

    public ContactResponse getContact(Long id) {

        return toResponse(getContactById(id));
    }

    public List<ContactResponse> getAllContacts() {

        return contactRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ContactResponse> getContactsByCompany(Long companyId) {

        getCompany(companyId);

        return contactRepository.findByCompanyId(companyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ContactResponse updateContact(
            Long id,
            UpdateContactRequest request
    ) {

        Contact contact = getContactById(id);

        if (request.getName() != null) {
            contact.setName(request.getName());
        }

        if (request.getEmail() != null) {
            contact.setEmail(request.getEmail());
        }

        if (request.getPhone() != null) {
            contact.setPhone(request.getPhone());
        }

        if (request.getDesignation() != null) {
            contact.setDesignation(request.getDesignation());
        }

        if (request.getCompanyId() != null) {
            contact.setCompany(
                    getCompany(request.getCompanyId())
            );
        }

        return toResponse(contactRepository.save(contact));
    }

    public void deleteContact(Long id) {

        Contact contact = getContactById(id);

        contactRepository.delete(contact);
    }

    private Contact getContactById(Long id) {

        return contactRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contact not found with id: " + id
                        )
                );
    }

    private Company getCompany(Long companyId) {

        if (companyId == null) {
            throw new ResourceNotFoundException(
                    "Company is required"
            );
        }

        return companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + companyId
                        )
                );
    }

    private ContactResponse toResponse(Contact contact) {

        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getDesignation(),
                contact.getCompany().getId(),
                contact.getCompany().getName()
        );
    }
}