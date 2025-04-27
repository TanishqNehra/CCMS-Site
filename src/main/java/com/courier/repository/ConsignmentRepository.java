package com.courier.repository;

import com.courier.model.Consignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsignmentRepository extends JpaRepository<Consignment, String> {
    List<Consignment> findByStatus(String status);
    List<Consignment> findByTruckId(String truckId);
}
