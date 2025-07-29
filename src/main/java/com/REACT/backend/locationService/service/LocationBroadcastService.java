package com.REACT.backend.locationService.service;

import com.REACT.backend.locationService.model.LocationBroadcastDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class LocationBroadcastService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastLocation(LocationBroadcastDto dto) {
        messagingTemplate.convertAndSend("/topic/location", dto);
    }

}