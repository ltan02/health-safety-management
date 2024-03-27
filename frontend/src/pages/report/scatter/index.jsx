import ReportChart from "../../../components/report/ReportChart.jsx";

function ScatterReport() {
    return (
        <ReportChart type="Scatter" val="category" locked={false} height={350}/>
    );
}

export default ScatterReport;