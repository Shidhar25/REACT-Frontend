package com.REACT.backend.users;

public enum UserType {
    CITIZEN,               // Default requester
    AMBULANCE_DRIVER,      // Assigned to ambulance
    POLICE_DRIVER,         // Handles police vehicle
    POLICE_OFFICER,        // General officer
    FIRE_DRIVER,           // Handles fire truck
    FIRE_STATION_ADMIN,    // Admin of local fire station
    ADMIN                  // Super Admin
}
