package com.leadpilot.repository;

import com.leadpilot.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}