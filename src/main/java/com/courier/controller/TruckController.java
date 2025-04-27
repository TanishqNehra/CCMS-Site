package com.courier.controller;

import com.courier.dto.TruckDTO;
import com.courier.service.TruckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trucks")
@CrossOrigin(origins = "*")
public class TruckController {

    @Autowired
    private TruckService truckService;
    
    @GetMapping
    public ResponseEntity<List<TruckDTO>> getAllTrucks(
            @RequestParam(required = false) String status) {
        
        if (status != null) {
            return ResponseEntity.ok(truckService.getTrucksByStatus(status));
        }
        
        return ResponseEntity.ok(truckService.getAllTrucks());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TruckDTO> getTruckById(@PathVariable String id) {
        TruckDTO truck = truckService.getTruckById(id);
        
        if (truck != null) {
            return ResponseEntity.ok(truck);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<TruckDTO> createTruck(@RequestBody TruckDTO truckDTO) {
        TruckDTO createdTruck = truckService.createTruck(truckDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTruck);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TruckDTO> updateTruck(
            @PathVariable String id, 
            @RequestBody TruckDTO truckDTO) {
        
        TruckDTO updatedTruck = truckService.updateTruck(id, truckDTO);
        
        if (updatedTruck != null) {
            return ResponseEntity.ok(updatedTruck);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTruck(@PathVariable String id) {
        boolean deleted = truckService.deleteTruck(id);
        
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/{id}/available")
    public ResponseEntity<TruckDTO> markAsAvailable(@PathVariable String id) {
        TruckDTO updatedTruck = truckService.markAsAvailable(id);
        
        if (updatedTruck != null) {
            return ResponseEntity.ok(updatedTruck);
        }
        
        return ResponseEntity.notFound().build();
    }
}
