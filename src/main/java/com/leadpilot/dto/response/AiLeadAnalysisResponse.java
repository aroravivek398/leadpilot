package com.leadpilot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiLeadAnalysisResponse {

    private String summary;
    private String interestsAndConcerns;
    private String nextBestAction;
    private String followUpDraft;
}