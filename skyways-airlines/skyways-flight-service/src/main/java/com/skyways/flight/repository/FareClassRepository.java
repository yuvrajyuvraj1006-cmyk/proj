package com.skyways.flight.repository;

import com.skyways.flight.entity.FareClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FareClassRepository extends JpaRepository<FareClass, UUID> {
    List<FareClass> findByFlight_FlightIdAndClassType(UUID flightId, String classType);
}
