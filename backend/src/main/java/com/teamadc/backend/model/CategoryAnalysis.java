package com.teamadc.backend.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryAnalysis {
    private String categoryName;
    private int totalIncidents;
    private List<StatusCategoryCount> statusCategoryCounts;

    public CategoryAnalysis() {
        // Default constructor
    }

    public CategoryAnalysis(String categoryName, int totalIncidents, List<StatusCategoryCount> statusCategoryCounts) {
        this.categoryName = categoryName;
        this.totalIncidents = totalIncidents;
        this.statusCategoryCounts = statusCategoryCounts;
    }
}
