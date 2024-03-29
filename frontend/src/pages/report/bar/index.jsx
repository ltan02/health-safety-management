import ReportChart from "../../../components/report/ReportChart.jsx";

function BarReport() {
    return (
        <ReportChart type="Bar" data={{field: "category"}} locked={false} height={350}/>
    );
}

export default BarReport;