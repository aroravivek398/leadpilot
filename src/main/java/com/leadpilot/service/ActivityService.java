package com.leadpilot.service;

import com.leadpilot.dto.request.CreateActivityRequest;
import com.leadpilot.dto.request.UpdateActivityRequest;
import com.leadpilot.dto.response.ActivityResponse;
import com.leadpilot.entity.Activity;
import com.leadpilot.entity.Lead;
import com.leadpilot.entity.LeadStage;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.ActivityRepository;
import com.leadpilot.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final LeadRepository leadRepository;

    public ActivityResponse createActivity(CreateActivityRequest request) {

        Lead lead = getLead(request.getLeadId());

        Activity activity = new Activity();
        activity.setType(request.getType());
        activity.setDescription(request.getDescription());
        activity.setActivityDate(request.getActivityDate());
        activity.setLead(lead);

        Activity savedActivity = activityRepository.save(activity);

        if (lead.getStage() == LeadStage.NEW) {
            lead.setStage(LeadStage.CONTACTED);
            leadRepository.save(lead);
        }

        return toResponse(savedActivity);
    }

    public ActivityResponse getActivity(Long id) {
        return toResponse(getActivityById(id));
    }

    public List<ActivityResponse> getAllActivities() {
        return activityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ActivityResponse> getActivitiesByLead(Long leadId) {

        getLead(leadId);

        return activityRepository.findByLeadIdOrderByActivityDateDesc(leadId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ActivityResponse updateActivity(
            Long id,
            UpdateActivityRequest request
    ) {

        Activity activity = getActivityById(id);

        if (request.getType() != null) {
            activity.setType(request.getType());
        }

        if (request.getDescription() != null) {
            activity.setDescription(request.getDescription());
        }

        if (request.getActivityDate() != null) {
            activity.setActivityDate(request.getActivityDate());
        }

        return toResponse(activityRepository.save(activity));
    }

    public void deleteActivity(Long id) {
        Activity activity = getActivityById(id);
        activityRepository.delete(activity);
    }

    private Activity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with id: " + id
                        )
                );
    }

    private Lead getLead(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Lead not found with id: " + id
                        )
                );
    }

    private ActivityResponse toResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getType(),
                activity.getDescription(),
                activity.getActivityDate(),
                activity.getLead().getId()
        );
    }
}