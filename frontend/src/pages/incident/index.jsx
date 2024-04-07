import { useState, useEffect } from "react";
import Dashboard from "../../components/incident/Dashboard";
import { useWorkflowNew } from "../../context/WorkflowContext";
import ViewWorkflowModal from "../../components/workflows/ViewWorkflowModal";
import AdminManagement from "../../pages/admin/management";

function Incident() {
    const { fetchWorkflowNew } = useWorkflowNew();

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleView = async () => {
        setEditModalOpen(true);
        setViewModalOpen(false);
    };

    useEffect(() => {
        fetchWorkflowNew();
    }, []);

    return (
        <div>
            <Dashboard setViewModalOpen={setViewModalOpen} />
            {viewModalOpen && (
                <ViewWorkflowModal
                    open={viewModalOpen}
                    handleClose={() => {
                        setViewModalOpen(false);
                    }}
                    handleEdit={handleView}
                />
            )}
            {editModalOpen && <AdminManagement open={editModalOpen} handleClose={() => setEditModalOpen(false)} />}
        </div>
    );
}
export default Incident;
