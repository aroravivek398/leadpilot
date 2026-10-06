package com.leadpilot.repository;

import com.leadpilot.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByLeadIdOrderByActivityDateDesc(Long leadId);
    void deleteByLeadId(Long leadId);
}