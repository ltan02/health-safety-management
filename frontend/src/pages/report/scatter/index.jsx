import ReportChart from "../../../components/report/ReportChart.jsx";

function ScatterReport() {
    return (
        <ReportChart type="Scatter" data={{field: "category"}} locked={false} height={350}/>
    );
}

export default ScatterReport;