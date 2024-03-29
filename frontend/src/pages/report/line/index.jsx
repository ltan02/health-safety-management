import ReportChart from "../../../components/report/ReportChart.jsx";

function LineReport() {
    return (
        <ReportChart type="Line" data={{field: "category"}} locked={false} height={350}/>
    );
}

export default LineReport;