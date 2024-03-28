import ReportChart from "../../../components/report/ReportChart.jsx";

function PieReport() {
    return (
        <ReportChart type="Pie" data={{field: "category"}} locked={false} height={350}/>
    );
}

export default PieReport;