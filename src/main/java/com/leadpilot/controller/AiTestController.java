package com.leadpilot.controller;

import com.leadpilot.dto.response.AiLeadAnalysisResponse;
import com.leadpilot.service.AiLeadAnalysisService;
import com.leadpilot.service.AiTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiTestController {

    private final AiTestService aiTestService;
    private final AiLeadAnalysisService aiLeadAnalysisService;

    @GetMapping("/test")
    public String testAi(
            @RequestParam(defaultValue = "Explain CRM in one sentence.") String prompt
    ) {
        return aiTestService.testChat(prompt);
    }

    @GetMapping("/leads/{leadId}")
    public AiLeadAnalysisResponse analyzeLead(
            @PathVariable Long leadId
    ) {
        return aiLeadAnalysisService.analyzeLead(leadId);
    }
}