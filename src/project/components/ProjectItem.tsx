import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

// Hooks
import { useHttpClient } from "../../hooks/Http-hook";

// Shared Component
import Button from "../../shared/FormElements/Button";
import Modal from "../../shared/UlElements/Modal";
import LoadingSpinner from "../../shared/UlElements/Loader";
import { AuthContext } from "../../context/AuthContext";

interface ProjectItemProps {
  id: string;
  projectName: string;
  description: string;
  creator: string;
  onDelete: (id: string) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  projectName,
  description,
  creator,
  onDelete,
  id,
}) => {
  const auth = useContext(AuthContext);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const { error, isLoading, sendReq } = useHttpClient();

  const deleteHandler = async () => {
    try {
      await sendReq(`http://localhost:4000/api/project/${id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      onDelete(id);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-[2px] shadow-lg">
      {isLoading && <LoadingSpinner asOverlay />}

      <Link to={`/projects/${id}/tickets`}>
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-primary">
            {projectName}
          </h2>
          <p className="text-[15px] text-gray-600">{description}</p>
        </div>
      </Link>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Link to={`/projects/${id}`}>
          <Button className="text-white bg-primary">Edit</Button>
        </Link>

        <div onClick={() => setOpenErrorModal(true)}>
          <Button className="text-white bg-red-500">Delete</Button>
        </div>

        <Modal
          modalType="delete"
          isOpen={openErrorModal}
          onClose={() => setOpenErrorModal(false)}
        >
          <p className="mb-6 text-center">
            Do you really want to delete this project? This process cannot be
            undone
          </p>
          <div className="flex items-center justify-center gap-5 pb-[40px]">
            <Button
              className="text-gray-600 bg-gray-200"
              onClick={() => setOpenErrorModal(false)}
            >
              Cancel
            </Button>
            {/* <Button onClick={() => console.log("ji")} variant="danger">
              Delete
            </Button> */}
            {/* <button onClick={deleteHandler}>Delete</button> */}
            <Button className="text-white bg-red-500" onClick={deleteHandler}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectItem;
