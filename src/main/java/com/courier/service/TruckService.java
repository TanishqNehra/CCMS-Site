package com.courier.service;

import com.courier.dto.TruckDTO;
import com.courier.model.Consignment;
import com.courier.model.Truck;
import com.courier.repository.ConsignmentRepository;
import com.courier.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TruckService {

    @Autowired
    private TruckRepository truckRepository;
    
    @Autowired
    private ConsignmentRepository consignmentRepository;
    
    public List<TruckDTO> getAllTrucks() {
        return truckRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TruckDTO> getTrucksByStatus(String status) {
        return truckRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TruckDTO getTruckById(String id) {
        Optional<Truck> truck = truckRepository.findById(id);
        return truck.map(this::convertToDTO).orElse(null);
    }
    
    @Transactional
    public TruckDTO createTruck(TruckDTO truckDTO) {
        Truck truck = new Truck();
        
        // Generate a unique ID
        String id = "TRK-" + new Random().nextInt(1000);
        truck.setId(id);
        
        // Set last maintenance date if not provided
        if (truckDTO.getLastMaintenance() == null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            truck.setLastMaintenance(LocalDateTime.now().format(formatter));
        } else {
            truck.setLastMaintenance(truckDTO.getLastMaintenance());
        }
        
        // Set default status
        truck.setStatus("available");
        
        // Set other fields
        truck.setDriver(truckDTO.getDriver());
        truck.setType(truckDTO.getType());
        truck.setCapacity(truckDTO.getCapacity());
        truck.setLocation(truckDTO.getLocation());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        truck.setCreatedAt(now);
        truck.setUpdatedAt(now);
        
        // Save to database
        Truck savedTruck = truckRepository.save(truck);
        
        return convertToDTO(savedTruck);
    }
    
    @Transactional
    public TruckDTO updateTruck(String id, TruckDTO truckDTO) {
        Optional<Truck> optionalTruck = truckRepository.findById(id);
        
        if (optionalTruck.isPresent()) {
            Truck truck = optionalTruck.get();
            
            // Update fields
            if (truckDTO.getDriver() != null) {
                truck.setDriver(truckDTO.getDriver());
            }
            if (truckDTO.getType() != null) {
                truck.setType(truckDTO.getType());
            }
            if (truckDTO.getCapacity() != null) {
                truck.setCapacity(truckDTO.getCapacity());
            }
            if (truckDTO.getLocation() != null) {
                truck.setLocation(truckDTO.getLocation());
            }
            if (truckDTO.getStatus() != null) {
                truck.setStatus(truckDTO.getStatus());
            }
            if (truckDTO.getLastMaintenance() != null) {
                truck.setLastMaintenance(truckDTO.getLastMaintenance());
            }
            
            // Update assigned consignment if provided
            if (truckDTO.getAssignedConsignmentId() != null) {
                Optional<Consignment> optionalConsignment = consignmentRepository.findById(truckDTO.getAssignedConsignmentId());
                optionalConsignment.ifPresent(truck::setAssignedConsignment);
            }
            
            // Update timestamp
            truck.setUpdatedAt(LocalDateTime.now());
            
            // Save to database
            Truck updatedTruck = truckRepository.save(truck);
            
            return convertToDTO(updatedTruck);
        }
        
        return null;
    }
    
    @Transactional
    public boolean deleteTruck(String id) {
        if (truckRepository.existsById(id)) {
            truckRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public TruckDTO markAsAvailable(String truckId) {
        Optional<Truck> optionalTruck = truckRepository.findById(truckId);
        
        if (optionalTruck.isPresent()) {
            Truck truck = optionalTruck.get();
            
            // Get the consignment before updating truck
            Consignment consignment = truck.getAssignedConsignment();
            
            // Update truck
            truck.setStatus("available");
            truck.setAssignedConsignment(null);
            truck.setUpdatedAt(LocalDateTime.now());
            
            // Update consignment if assigned
            if (consignment != null) {
                consignment.setStatus("pending");
                consignment.setTruck(null);
                consignment.setUpdatedAt(LocalDateTime.now());
                consignmentRepository.save(consignment);
            }
            
            // Save truck
            Truck updatedTruck = truckRepository.save(truck);
            
            return convertToDTO(updatedTruck);
        }
        
        return null;
    }
    
    // Helper method to convert Entity to DTO
    private TruckDTO convertToDTO(Truck truck) {
        TruckDTO dto = new TruckDTO();
        dto.setId(truck.getId());
        dto.setDriver(truck.getDriver());
        dto.setType(truck.getType());
        dto.setCapacity(truck.getCapacity());
        dto.setLocation(truck.getLocation());
        dto.setStatus(truck.getStatus());
        dto.setLastMaintenance(truck.getLastMaintenance());
        dto.setCreatedAt(truck.getCreatedAt());
        dto.setUpdatedAt(truck.getUpdatedAt());
        
        if (truck.getAssignedConsignment() != null) {
            dto.setAssignedConsignmentId(truck.getAssignedConsignment().getId());
        }
        
        return dto;
    }
}
