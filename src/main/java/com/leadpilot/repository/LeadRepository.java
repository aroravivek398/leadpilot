package com.leadpilot.repository;

import com.leadpilot.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {

    List<Lead> findByCompanyId(Long companyId);

    List<Lead> findByContactId(Long contactId);

    @Query("""
            SELECT l.stage, COUNT(l)
            FROM Lead l
            GROUP BY l.stage
            """)
    List<Object[]> countLeadsByStage();

    @Query("""
            SELECT l.stage, COALESCE(SUM(l.estimatedValue), 0)
            FROM Lead l
            GROUP BY l.stage
            """)
    List<Object[]> sumLeadValueByStage();


    List<Lead> findByAssignedUserId(Long userId);

    List<Lead> findByCompanyIdAndAssignedUserId(Long companyId, Long userId);

    List<Lead> findByContactIdAndAssignedUserId(Long contactId, Long userId);
}