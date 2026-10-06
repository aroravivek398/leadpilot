package com.leadpilot.controller;

import com.leadpilot.dto.request.CreateFollowUpRequest;
import com.leadpilot.dto.request.UpdateFollowUpRequest;
import com.leadpilot.dto.response.FollowUpResponse;
import com.leadpilot.service.FollowUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follow-ups")
@RequiredArgsConstructor
public class FollowUpController {

    private final FollowUpService followUpService;

    @PostMapping
    public ResponseEntity<FollowUpResponse> createFollowUp(
            @Valid @RequestBody CreateFollowUpRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(followUpService.createFollowUp(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FollowUpResponse> getFollowUp(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                followUpService.getFollowUp(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<FollowUpResponse>> getAllFollowUps() {
        return ResponseEntity.ok(
                followUpService.getAllFollowUps()
        );
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<FollowUpResponse>> getFollowUpsByLead(
            @PathVariable Long leadId
    ) {
        return ResponseEntity.ok(
                followUpService.getFollowUpsByLead(leadId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUpResponse> updateFollowUp(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFollowUpRequest request
    ) {
        return ResponseEntity.ok(
                followUpService.updateFollowUp(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowUp(
            @PathVariable Long id
    ) {
        followUpService.deleteFollowUp(id);
        return ResponseEntity.noContent().build();
    }
}