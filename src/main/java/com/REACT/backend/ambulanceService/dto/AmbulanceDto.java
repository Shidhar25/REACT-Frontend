    package com.REACT.backend.ambulanceService.dto;

    import com.REACT.backend.ambulanceService.model.AmbulanceEntity;
    import com.REACT.backend.ambulanceService.model.AmbulanceStatus;
    import com.REACT.backend.users.model.AmbulanceDriver;
    import com.REACT.backend.users.repository.AmbulanceDriverRepository;
    import lombok.*;

    import java.time.Instant;

    @Getter
    @Setter
    @AllArgsConstructor
    @Builder
    @RequiredArgsConstructor
    public class AmbulanceDto {

        private Long id;
        private String regNumber;
        private String driverName;
        private String driverPhone;
        private String license;
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
                this.license = entity.getLicense();
            }
            if (entity.getLocation() != null) {
                this.latitude = entity.getLocation().getY();
                this.longitude = entity.getLocation().getX();
            }
        }
    }
