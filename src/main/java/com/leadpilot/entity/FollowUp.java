package com.leadpilot.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "follow_ups")
@Getter
@Setter
@NoArgsConstructor
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @Size(max = 1000)
    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime dueDate;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FollowUpStatus status = FollowUpStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "lead_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_follow_up_lead")
    )
    private Lead lead;
}