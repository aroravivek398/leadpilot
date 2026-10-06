package com.leadpilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String name;

    @Size(max = 100)
    @Column(length = 100)
    private String industry;

    @Size(max = 255)
    @Column(length = 255)
    private String website;

    @Size(max = 30)
    @Column(length = 30)
    private String phone;

    @Email
    @Size(max = 255)
    @Column(length = 255)
    private String email;

    @Size(max = 500)
    @Column(length = 500)
    private String address;


}