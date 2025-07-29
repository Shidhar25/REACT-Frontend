    package com.REACT.backend.ambulanceService.dto;

    import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
    import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
    import lombok.*;

    import java.time.Instant;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class AmbulanceDto {
        private Long id;
        private String regNumber;
        private String driverName;
        private String driverPhone;
        private AmbulanceStatus status;
        private double latitude;
        private double longitude;
        private Instant lastUpdated;

        public AmbulanceDto(AmbulanceEntity entity) {
            this.id = entity.getId();
            this.regNumber = entity.getAmbulanceRegNumber();
            this.status = entity.getStatus();
            this.lastUpdated = entity.getLastUpdated();
            this.status = entity.getStatus();
            if (entity.getDriver() != null) {
                this.driverName = entity.getDriver().getUserFullName();
                this.driverPhone = entity.getDriver().getPhoneNumber();
            }
            if (entity.getLocation() != null) {
                this.latitude = entity.getLocation().getY();
                this.longitude = entity.getLocation().getX();
            }
        }
    }
