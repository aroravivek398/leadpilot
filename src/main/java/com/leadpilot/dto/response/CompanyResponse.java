package com.leadpilot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CompanyResponse {

    private Long id;
    private String name;
    private String industry;
    private String website;
    private String phone;
    private String email;
    private String address;

}