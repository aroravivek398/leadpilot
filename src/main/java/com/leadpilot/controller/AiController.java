package com.leadpilot.controller;

import com.leadpilot.dto.response.AiLeadAnalysisResponse;
import com.leadpilot.service.AiLeadAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiLeadAnalysisService aiLeadAnalysisService;

    @GetMapping("/leads/{leadId}")
    public AiLeadAnalysisResponse analyzeLead(@PathVariable Long leadId) {
        return aiLeadAnalysisService.analyzeLead(leadId);
    }
}