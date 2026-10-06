package com.leadpilot.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCompanyRequest {

    @NotBlank
    @Size(max = 150)
    private String name;

    @Size(max = 100)
    private String industry;

    @Size(max = 255)
    private String website;

    @Size(max = 30)
    private String phone;

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 500)
    private String address;
}