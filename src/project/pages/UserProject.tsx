// Shared Component
import { useContext, useEffect, useState } from "react";

//Hooks
import { useHttpClient } from "../../hooks/Http-hook";

// Context
import { AuthContext } from "../../context/AuthContext";

// Shared Components
import Layout from "../../shared/Layout/Dashboard";
import Modal from "../../shared/UlElements/Modal";
import LoadingSpinner from "../../shared/UlElements/Loader";

// Component
import ProjectList from "../components/ProjectList";

interface Project {
  _id: string;
  projectName: string;
  description: string;
  creator: string;
}

const UserProject = () => {
  const [loadedData, setLoadedData] = useState<Project[]>();
  const [openModal, setOpenModal] = useState(false);
  const { error, isLoading, sendReq } = useHttpClient();

  // const { userId } = useParams<RouteParams>();
  const auth = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const responseData = await sendReq(
        `https://team-forge-backend-zdrga.ondigitalocean.app/api/project/user/${auth.userId}`
      );
      setLoadedData(responseData.project);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProjects();
  }, [sendReq, auth.userId]);

  useEffect(() => {}, [loadedData]);

  const deleteProjectHandler = (deletedProjectId: string) => {
    setLoadedData((prevProject) =>
      prevProject?.filter((project) => project._id !== deletedProjectId)
    );
  };

  useEffect(() => {
    if (error) {
      setOpenModal(true);
    }
  }, []);

  return (
    <>
      <Layout>
        {error && (
          <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
            <p>{error}</p>
          </Modal>
        )}
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && loadedData && (
          <ProjectList
            items={loadedData}
            onDeleteProject={deleteProjectHandler}
          />
        )}
      </Layout>
    </>
  );
};

export default UserProject;
