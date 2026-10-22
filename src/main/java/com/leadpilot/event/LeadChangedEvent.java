package com.leadpilot.event;

/**
 * Published whenever a lead, one of its activities or one of its follow-ups changes.
 * After the database transaction commits, a listener refreshes the lead in the vector store.
 */
public record LeadChangedEvent(Long leadId) {
}