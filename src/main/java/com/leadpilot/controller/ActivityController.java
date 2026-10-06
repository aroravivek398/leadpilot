package com.leadpilot.controller;

import com.leadpilot.dto.request.CreateActivityRequest;
import com.leadpilot.dto.request.UpdateActivityRequest;
import com.leadpilot.dto.response.ActivityResponse;
import com.leadpilot.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @Valid @RequestBody CreateActivityRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(activityService.createActivity(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivity(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(activityService.getActivity(id));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/lead/{leadId}")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByLead(
            @PathVariable Long leadId
    ) {
        return ResponseEntity.ok(
                activityService.getActivitiesByLead(leadId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateActivityRequest request
    ) {
        return ResponseEntity.ok(
                activityService.updateActivity(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id
    ) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}