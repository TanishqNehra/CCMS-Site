package com.courier.service;

import com.courier.dto.ConsignmentDTO;
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
public class ConsignmentService {

    @Autowired
    private ConsignmentRepository consignmentRepository;
    
    @Autowired
    private TruckRepository truckRepository;
    
    public List<ConsignmentDTO> getAllConsignments() {
        return consignmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ConsignmentDTO> getConsignmentsByStatus(String status) {
        return consignmentRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ConsignmentDTO getConsignmentById(String id) {
        Optional<Consignment> consignment = consignmentRepository.findById(id);
        return consignment.map(this::convertToDTO).orElse(null);
    }
    
    @Transactional
    public ConsignmentDTO createConsignment(ConsignmentDTO consignmentDTO) {
        Consignment consignment = new Consignment();
        
        // Generate a unique ID
        String id = "CCM" + new Random().nextInt(10000000);
        consignment.setId(id);
        
        // Set current date if not provided
        if (consignmentDTO.getDate() == null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            consignment.setDate(LocalDateTime.now().format(formatter));
        } else {
            consignment.setDate(consignmentDTO.getDate());
        }
        
        // Set default status
        consignment.setStatus("pending");
        
        // Set other fields
        consignment.setCustomer(consignmentDTO.getCustomer());
        consignment.setType(consignmentDTO.getType());
        consignment.setWeight(consignmentDTO.getWeight());
        consignment.setDestination(consignmentDTO.getDestination());
        consignment.setContact(consignmentDTO.getContact());
        consignment.setEmail(consignmentDTO.getEmail());
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        consignment.setCreatedAt(now);
        consignment.setUpdatedAt(now);
        
        // Save to database
        Consignment savedConsignment = consignmentRepository.save(consignment);
        
        return convertToDTO(savedConsignment);
    }
    
    @Transactional
    public ConsignmentDTO updateConsignment(String id, ConsignmentDTO consignmentDTO) {
        Optional<Consignment> optionalConsignment = consignmentRepository.findById(id);
        
        if (optionalConsignment.isPresent()) {
            Consignment consignment = optionalConsignment.get();
            
            // Update fields
            if (consignmentDTO.getCustomer() != null) {
                consignment.setCustomer(consignmentDTO.getCustomer());
            }
            if (consignmentDTO.getType() != null) {
                consignment.setType(consignmentDTO.getType());
            }
            if (consignmentDTO.getWeight() != null) {
                consignment.setWeight(consignmentDTO.getWeight());
            }
            if (consignmentDTO.getDestination() != null) {
                consignment.setDestination(consignmentDTO.getDestination());
            }
            if (consignmentDTO.getStatus() != null) {
                consignment.setStatus(consignmentDTO.getStatus());
            }
            if (consignmentDTO.getContact() != null) {
                consignment.setContact(consignmentDTO.getContact());
            }
            if (consignmentDTO.getEmail() != null) {
                consignment.setEmail(consignmentDTO.getEmail());
            }
            
            // Update truck if provided
            if (consignmentDTO.getTruckId() != null) {
                Optional<Truck> optionalTruck = truckRepository.findById(consignmentDTO.getTruckId());
                optionalTruck.ifPresent(consignment::setTruck);
            }
            
            // Update timestamp
            consignment.setUpdatedAt(LocalDateTime.now());
            
            // Save to database
            Consignment updatedConsignment = consignmentRepository.save(consignment);
            
            return convertToDTO(updatedConsignment);
        }
        
        return null;
    }
    
    @Transactional
    public boolean deleteConsignment(String id) {
        if (consignmentRepository.existsById(id)) {
            consignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    @Transactional
    public ConsignmentDTO allocateTruck(String consignmentId, String truckId) {
        Optional<Consignment> optionalConsignment = consignmentRepository.findById(consignmentId);
        Optional<Truck> optionalTruck = truckRepository.findById(truckId);
        
        if (optionalConsignment.isPresent() && optionalTruck.isPresent()) {
            Consignment consignment = optionalConsignment.get();
            Truck truck = optionalTruck.get();
            
            // Check if truck is available
            if (!"available".equals(truck.getStatus())) {
                throw new IllegalStateException("Truck is not available");
            }
            
            // Update consignment
            consignment.setStatus("in-transit");
            consignment.setTruck(truck);
            consignment.setUpdatedAt(LocalDateTime.now());
            
            // Update truck
            truck.setStatus("in-transit");
            truck.setAssignedConsignment(consignment);
            truck.setUpdatedAt(LocalDateTime.now());
            
            // Save both entities
            consignmentRepository.save(consignment);
            truckRepository.save(truck);
            
            return convertToDTO(consignment);
        }
        
        return null;
    }
    
    @Transactional
    public ConsignmentDTO markAsDelivered(String consignmentId) {
        Optional<Consignment> optionalConsignment = consignmentRepository.findById(consignmentId);
        
        if (optionalConsignment.isPresent()) {
            Consignment consignment = optionalConsignment.get();
            
            // Get the truck before updating consignment
            Truck truck = consignment.getTruck();
            
            // Update consignment
            consignment.setStatus("delivered");
            consignment.setTruck(null);
            consignment.setUpdatedAt(LocalDateTime.now());
            
            // Update truck if assigned
            if (truck != null) {
                truck.setStatus("available");
                truck.setAssignedConsignment(null);
                truck.setUpdatedAt(LocalDateTime.now());
                truckRepository.save(truck);
            }
            
            // Save consignment
            Consignment updatedConsignment = consignmentRepository.save(consignment);
            
            return convertToDTO(updatedConsignment);
        }
        
        return null;
    }
    
    // Helper method to convert Entity to DTO
    private ConsignmentDTO convertToDTO(Consignment consignment) {
        ConsignmentDTO dto = new ConsignmentDTO();
        dto.setId(consignment.getId());
        dto.setCustomer(consignment.getCustomer());
        dto.setType(consignment.getType());
        dto.setWeight(consignment.getWeight());
        dto.setDestination(consignment.getDestination());
        dto.setStatus(consignment.getStatus());
        dto.setDate(consignment.getDate());
        dto.setContact(consignment.getContact());
        dto.setEmail(consignment.getEmail());
        dto.setCreatedAt(consignment.getCreatedAt());
        dto.setUpdatedAt(consignment.getUpdatedAt());
        
        if (consignment.getTruck() != null) {
            dto.setTruckId(consignment.getTruck().getId());
        }
        
        return dto;
    }
}
