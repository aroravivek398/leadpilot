package com.leadpilot.controller;

import com.leadpilot.dto.request.CreateContactRequest;
import com.leadpilot.dto.request.UpdateContactRequest;
import com.leadpilot.dto.response.ContactResponse;
import com.leadpilot.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(
            @Valid @RequestBody CreateContactRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(contactService.createContact(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContact(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                contactService.getContact(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {

        return ResponseEntity.ok(
                contactService.getAllContacts()
        );
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<ContactResponse>> getContactsByCompany(
            @PathVariable Long companyId
    ) {
        return ResponseEntity.ok(
                contactService.getContactsByCompany(companyId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContactRequest request
    ) {
        return ResponseEntity.ok(
                contactService.updateContact(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @PathVariable Long id
    ) {
        contactService.deleteContact(id);

        return ResponseEntity.noContent().build();
    }
}