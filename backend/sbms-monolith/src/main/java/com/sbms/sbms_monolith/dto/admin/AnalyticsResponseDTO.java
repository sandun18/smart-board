package com.sbms.sbms_monolith.dto.admin;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AnalyticsResponseDTO {
    private List<StatDetail> stats;
    private ChartData studentTrend;
    private ChartData listingTrend;
    private ChartData categoryData;

    @Data
    @Builder
    public static class StatDetail {
        private String label;
        private String value;
        private String change;
        private boolean increase;
        private String icon; // Maps to Lucide icons on frontend
    }

    @Data
    @Builder
    public static class ChartData {
        private List<String> labels;
        private List<Dataset> datasets;
    }

    @Data
    @Builder
    public static class Dataset {
        private String label;
        private List<Integer> data;
    }
}