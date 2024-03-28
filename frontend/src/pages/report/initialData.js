export const categoryReports = [
    {
        id: 1, 
        label: "Environmental Hazard",
        value: 71
    }, 
    {
        id: 2,
        label: "Workplace Injury",
        value: 2
    }, 
    {
        id: 3,
        label: "Health Incident",
        value: 13
    }, 
    {
        id: 4,
        label: "Security Breach",
        value: 42
    }, 
    {
        id: 5,
        label: "Equipment Malfunction",
        value: 50
    }, 
    {
        id: 6,
        label: "Fire Safety",
        value: 61
    }
]

export const dashboardData = [
    {
        type: "Bar",
        field: "category",
        start: null,
        end: null
    }, 
    {
        type: "Line",
        field: "reporter",
        start: null,
        end: null
    },
    {
        type: "Pie",
        field: "status",
        start: null,
        end: null
    }, 
    {
        type: "Scatter",
        field: "date",
        start: null,
        end: null
    } 
]