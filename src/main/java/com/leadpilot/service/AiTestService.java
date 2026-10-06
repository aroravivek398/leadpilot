package com.leadpilot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiTestService {

    private final ChatClient chatClient;

    public String testChat(String prompt) {

        return chatClient
                .prompt()
                .user(prompt)
                .call()
                .content();
    }
}