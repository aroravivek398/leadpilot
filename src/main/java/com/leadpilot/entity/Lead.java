package com.leadpilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LeadSource source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LeadStage stage;

    @Column(precision = 15, scale = 2)
    private BigDecimal estimatedValue;

    @Size(max = 1000)
    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "company_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lead_company")
    )
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "contact_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lead_contact")
    )
    private Contact contact;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "assigned_user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_lead_assigned_user")
    )
    private User assignedUser;
}