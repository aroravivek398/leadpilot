package com.leadpilot.service;

import com.leadpilot.dto.request.CreateCompanyRequest;
import com.leadpilot.dto.request.UpdateCompanyRequest;
import com.leadpilot.dto.response.CompanyResponse;
import com.leadpilot.entity.Company;
import com.leadpilot.exception.ResourceNotFoundException;
import com.leadpilot.repository.CompanyRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyResponse createCompany(CreateCompanyRequest request) {

        Company company = new Company();
        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setAddress(request.getAddress());


        return toResponse(companyRepository.save(company));
    }

    public CompanyResponse getCompany(Long id) {

        Company company = getCompanyById(id);

        return toResponse(company);
    }

    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }



    public CompanyResponse updateCompany(
            Long id,
            UpdateCompanyRequest request
    ) {

        Company company = getCompanyById(id);

        if (request.getName() != null) {
            company.setName(request.getName());
        }

        if (request.getIndustry() != null) {
            company.setIndustry(request.getIndustry());
        }

        if (request.getWebsite() != null) {
            company.setWebsite(request.getWebsite());
        }

        if (request.getPhone() != null) {
            company.setPhone(request.getPhone());
        }

        if (request.getEmail() != null) {
            company.setEmail(request.getEmail());
        }

        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }


        return toResponse(companyRepository.save(company));
    }

    public void deleteCompany(Long id) {

        Company company = getCompanyById(id);

        companyRepository.delete(company);
    }

    private Company getCompanyById(Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id
                        )
                );
    }



    private CompanyResponse toResponse(Company company) {

        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getIndustry(),
                company.getWebsite(),
                company.getPhone(),
                company.getEmail(),
                company.getAddress()
        );
    }
}