package com.leadpilot.controller;

import com.leadpilot.dto.request.CreateLeadRequest;
import com.leadpilot.dto.request.UpdateLeadRequest;
import com.leadpilot.dto.response.LeadResponse;
import com.leadpilot.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(
            @Valid @RequestBody CreateLeadRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(leadService.createLead(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLead(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLead(id));
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<LeadResponse>> getLeadsByCompany(
            @PathVariable Long companyId
    ) {
        return ResponseEntity.ok(leadService.getLeadsByCompany(companyId));
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<LeadResponse>> getLeadsByContact(
            @PathVariable Long contactId
    ) {
        return ResponseEntity.ok(leadService.getLeadsByContact(contactId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeadRequest request
    ) {
        return ResponseEntity.ok(leadService.updateLead(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}