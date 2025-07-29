package com.REACT.backend.fireService.service.impl;


import com.REACT.backend.common.util.LocationUtils;
import com.REACT.backend.fireService.dto.FireTruckLocationUpdateDto;
import com.REACT.backend.fireService.model.FireTruckEntity;
import com.REACT.backend.fireService.repository.FireTruckRepository;
import com.REACT.backend.fireService.service.FireTruckLocationUpdateService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class FireTruckLocationUpdateServiceImplementation implements FireTruckLocationUpdateService {



    private final FireTruckRepository fireTruckRepo;
    private final LocationUtils locationUtils;


    @Override
    @Transactional
    public void updateLocation(FireTruckLocationUpdateDto locationUpdateDto) {
      log.info("No such truck with truckId={} present in DB",locationUpdateDto.getTruckId());
      FireTruckEntity entity = fireTruckRepo.findById(locationUpdateDto.getTruckId())
              .orElseThrow(()-> new RuntimeException("No such fire Truck Exist"+locationUpdateDto.getTruckId()));


      entity.setLocation(locationUtils.createPoint(locationUpdateDto.getLongitude(),locationUpdateDto.getLatitude()));
      fireTruckRepo.save(entity);
      log.info("Location of fire truckId={} updated",locationUpdateDto.getTruckId());
    }


}
