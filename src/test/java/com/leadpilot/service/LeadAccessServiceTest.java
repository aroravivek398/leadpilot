package com.leadpilot.service;

import com.leadpilot.entity.Lead;
import com.leadpilot.entity.User;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.LeadRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeadAccessServiceTest {

    @Mock
    private LeadRepository leadRepository;

    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private LeadAccessService leadAccessService;

    private User userWithId(Long id) {
        User user = mock(User.class);
        when(user.getId()).thenReturn(id);
        return user;
    }

    @Test
    void returnsLead_whenLeadIsAssignedToCurrentUser() {
        User me = userWithId(1L);
        Lead lead = new Lead();
        lead.setAssignedUser(me);

        when(currentUserService.getCurrentUser()).thenReturn(me);
        when(leadRepository.findById(10L)).thenReturn(Optional.of(lead));

        Lead result = leadAccessService.getOwnedLead(10L);

        assertEquals(lead, result);
    }

    @Test
    void throwsNotFound_whenLeadBelongsToAnotherUser() {
        User me = userWithId(1L);
        User someoneElse = userWithId(2L);
        Lead lead = new Lead();
        lead.setAssignedUser(someoneElse);

        when(currentUserService.getCurrentUser()).thenReturn(me);
        when(leadRepository.findById(10L)).thenReturn(Optional.of(lead));

        assertThrows(ResourceNotFoundException.class,
                () -> leadAccessService.getOwnedLead(10L));
    }

    @Test
    void throwsNotFound_whenLeadDoesNotExist() {
        User me = userWithId(1L);

        when(currentUserService.getCurrentUser()).thenReturn(me);
        when(leadRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> leadAccessService.getOwnedLead(99L));
    }
}