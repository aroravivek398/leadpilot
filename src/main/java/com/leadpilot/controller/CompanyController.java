package com.leadpilot.controller;

import com.leadpilot.dto.request.CreateCompanyRequest;
import com.leadpilot.dto.request.UpdateCompanyRequest;
import com.leadpilot.dto.response.CompanyResponse;
import com.leadpilot.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(
            @Valid @RequestBody CreateCompanyRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(companyService.createCompany(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompany(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                companyService.getCompany(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {

        return ResponseEntity.ok(
                companyService.getAllCompanies()
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCompanyRequest request
    ) {
        return ResponseEntity.ok(
                companyService.updateCompany(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable Long id
    ) {
        companyService.deleteCompany(id);

        return ResponseEntity.noContent().build();
    }
}