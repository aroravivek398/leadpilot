package com.leadpilot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ContactResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String designation;
    private Long companyId;
    private String companyName;
}