package com.courier.controller;

import com.courier.dto.ConsignmentDTO;
import com.courier.service.ConsignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consignments")
@CrossOrigin(origins = "*")
public class ConsignmentController {

    @Autowired
    private ConsignmentService consignmentService;
    
    @GetMapping
    public ResponseEntity<List<ConsignmentDTO>> getAllConsignments(
            @RequestParam(required = false) String status) {
        
        if (status != null) {
            return ResponseEntity.ok(consignmentService.getConsignmentsByStatus(status));
        }
        
        return ResponseEntity.ok(consignmentService.getAllConsignments());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ConsignmentDTO> getConsignmentById(@PathVariable String id) {
        ConsignmentDTO consignment = consignmentService.getConsignmentById(id);
        
        if (consignment != null) {
            return ResponseEntity.ok(consignment);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<ConsignmentDTO> createConsignment(@RequestBody ConsignmentDTO consignmentDTO) {
        ConsignmentDTO createdConsignment = consignmentService.createConsignment(consignmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdConsignment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ConsignmentDTO> updateConsignment(
            @PathVariable String id, 
            @RequestBody ConsignmentDTO consignmentDTO) {
        
        ConsignmentDTO updatedConsignment = consignmentService.updateConsignment(id, consignmentDTO);
        
        if (updatedConsignment != null) {
            return ResponseEntity.ok(updatedConsignment);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsignment(@PathVariable String id) {
        boolean deleted = consignmentService.deleteConsignment(id);
        
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{consignmentId}/allocate/{truckId}")
    public ResponseEntity<ConsignmentDTO> allocateTruck(
            @PathVariable String consignmentId,
            @PathVariable String truckId) {
        
        try {
            ConsignmentDTO updatedConsignment = consignmentService.allocateTruck(consignmentId, truckId);
            
            if (updatedConsignment != null) {
                return ResponseEntity.ok(updatedConsignment);
            }
            
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/deliver")
    public ResponseEntity<ConsignmentDTO> markAsDelivered(@PathVariable String id) {
        ConsignmentDTO updatedConsignment = consignmentService.markAsDelivered(id);
        
        if (updatedConsignment != null) {
            return ResponseEntity.ok(updatedConsignment);
        }
        
        return ResponseEntity.notFound().build();
    }
}
