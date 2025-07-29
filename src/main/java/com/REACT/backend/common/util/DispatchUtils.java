package com.REACT.backend.common.util;

import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@Slf4j
public class DispatchUtils {

    private static final int NO_REQUEST = 0;

    /**
     * @return "FULL" if ambulance assigned, "NONE" otherwise
     */


    /**
     * @param assigned  how many officers were dispatched
     * @param requested how many were requested
     * @return "N/A" if none requested, otherwise "NONE"/"PARTIAL"/"FULL"
     */
    public static String policeStatus(int assigned, int requested) {
        log.info("Police Assignment Status report updated");
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";

        return "FULL";
    }

    /**
     * @param assigned  how many fire trucks were dispatched
     * @param requested how many were requested
     * @return same logic as policeStatus but for fire trucks
     */
    public static String fireTruckStatus(int assigned, int requested) {
        log.info("Fire Truck Assignment report updated");
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";
        return "FULL";
    }
    public static String ambulanceStatus(int assigned, int requested) {
        log.info("Ambulance Assignment report updated");
        if (requested == NO_REQUEST)   return "N/A";
        if (assigned == 0)             return "NONE";
        if (assigned < requested)      return "PARTIAL";
        return "FULL";
    }

}
