package com.leadpilot.repository;

import com.leadpilot.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.leadpilot.entity.FollowUpStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByLeadIdOrderByDueDateAsc(Long leadId);

    @Query("""
            SELECT f.status, COUNT(f)
            FROM FollowUp f
            GROUP BY f.status
            """)
    List<Object[]> countFollowUpsByCompletion();
    void deleteByLeadId(Long leadId);

    @Modifying
    @Query("""
            UPDATE FollowUp f
            SET f.status = :overdue
            WHERE f.status = :pending AND f.dueDate < :now
            """)
    int markOverdue(
            @Param("pending") FollowUpStatus pending,
            @Param("overdue") FollowUpStatus overdue,
            @Param("now") LocalDateTime now
    );
}