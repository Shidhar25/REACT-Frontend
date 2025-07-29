package com.REACT.backend.common.util;

import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class LocationUtils {

    private static final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public Point createPoint(double latitude, double longitude) {
        log.info("Location conversion request for latitude={} and longitude={} fetched",latitude,longitude);
        Point conversion = geometryFactory.createPoint(new Coordinate(longitude, latitude)); // Note: (lng, lat)
        log.info("Location converted to point: {}",conversion.toString());
        return conversion;
    }
}
