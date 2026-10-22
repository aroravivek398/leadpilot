package com.leadpilot.dto.response;

import java.util.List;

public record AskCrmResponse(String answer, List<Source> sources) {

    public record Source(Long leadId, String leadName) {
    }
}