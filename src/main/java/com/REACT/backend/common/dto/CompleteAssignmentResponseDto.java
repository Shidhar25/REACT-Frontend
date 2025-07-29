package com.REACT.backend.common.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CompleteAssignmentResponseDto {
    private Instant completedAt;
    private long duration;
}
