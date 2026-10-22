package com.leadpilot.controller;

import com.leadpilot.dto.request.AskCrmRequest;
import com.leadpilot.dto.response.AiLeadAnalysisResponse;
import com.leadpilot.dto.response.AskCrmResponse;
import com.leadpilot.exception.AiServiceException;
import com.leadpilot.service.AiLeadAnalysisService;
import com.leadpilot.service.AskCrmService;
import com.leadpilot.service.CurrentUserService;
import com.leadpilot.service.LeadIndexService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiLeadAnalysisService aiLeadAnalysisService;
    private final AskCrmService askCrmService;
    private final LeadIndexService leadIndexService;
    private final CurrentUserService currentUserService;

    @GetMapping("/leads/{leadId}")
    public AiLeadAnalysisResponse analyzeLead(@PathVariable Long leadId) {
        return aiLeadAnalysisService.analyzeLead(leadId);
    }

    @PostMapping("/ask")
    public AskCrmResponse ask(@Valid @RequestBody AskCrmRequest request) {
        return askCrmService.ask(request.question());
    }

    /** Builds (or rebuilds) the search index for the current user's leads. */
    @PostMapping("/index")
    public Map<String, Integer> reindex() {
        Long userId = currentUserService.getCurrentUser().getId();
        try {
            return Map.of("leadsIndexed", leadIndexService.reindexAllForUser(userId));
        } catch (Exception e) {
            throw new AiServiceException("Indexing failed", e);
        }
    }
}