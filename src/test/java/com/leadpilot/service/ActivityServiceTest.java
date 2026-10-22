package com.leadpilot.service;

import com.leadpilot.dto.request.CreateActivityRequest;
import com.leadpilot.entity.Activity;
import com.leadpilot.entity.ActivityType;
import com.leadpilot.entity.Lead;
import com.leadpilot.entity.LeadStage;
import com.leadpilot.repository.ActivityRepository;
import com.leadpilot.repository.LeadRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import com.leadpilot.event.LeadChangedEvent;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private LeadAccessService leadAccessService;

    @Mock
    private CurrentUserService currentUserService;



    @InjectMocks
    private ActivityService activityService;
    @Mock
    private ApplicationEventPublisher eventPublisher;

    private CreateActivityRequest requestForLead(Long leadId) {
        CreateActivityRequest request = new CreateActivityRequest();
        request.setType(ActivityType.CALL);
        request.setDescription("Intro call");
        request.setActivityDate(LocalDateTime.now());
        request.setLeadId(leadId);
        return request;
    }

    @Test
    void firstActivityOnNewLead_movesStageToContacted() {
        Lead lead = new Lead();
        lead.setStage(LeadStage.NEW);

        when(leadAccessService.getOwnedLead(5L)).thenReturn(lead);
        when(activityRepository.save(any(Activity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        activityService.createActivity(requestForLead(5L));

        assertEquals(LeadStage.CONTACTED, lead.getStage());
        verify(leadRepository).save(lead);
    }

    @Test
    void activityOnLeadAlreadyPastNew_keepsStage() {
        Lead lead = new Lead();
        lead.setStage(LeadStage.INTERESTED);

        when(leadAccessService.getOwnedLead(5L)).thenReturn(lead);
        when(activityRepository.save(any(Activity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        activityService.createActivity(requestForLead(5L));

        assertEquals(LeadStage.INTERESTED, lead.getStage());
        verify(leadRepository, never()).save(any(Lead.class));
    }
}