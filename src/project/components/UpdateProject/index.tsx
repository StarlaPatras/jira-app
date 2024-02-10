import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";

// React-hook-form
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";

// Hooks
import { useHttpClient } from "../../../hooks/Http-hook";

// Context
import { AuthContext } from "../../../context/AuthContext";

// Shared Components
import Input from "../../../shared/FormElements/Input";
import Button from "../../../shared/FormElements/Button";
import LoadingSpinner from "../../../shared/UlElements/Loader";

interface RouteParams {
  projectId: string;
}

interface FormData {
  projectName: string;
  description: string;
}

const UpdateProject: React.FC = () => {
  const { error, isLoading, sendReq } = useHttpClient();
  const [loadedData, setLoadedData] = useState();
  const { projectId } = useParams<RouteParams>();
  const methods = useForm<FormData>();
  const auth = useContext(AuthContext);
  const history = useHistory();

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendReq(
          `http://localhost:4000/api/project/${projectId}`,
          "GET"
        );

        setLoadedData(responseData.project);

        // Populate form fields with loaded data
        setValue("projectName", responseData.project.projectName);
        setValue("description", responseData.project.description);
      } catch (err) {}
    };
    fetchData();
  }, [sendReq, projectId, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const responseData = await sendReq(
        `http://localhost:4000/api/project/${projectId}`,
        "PATCH", // Use PATCH method for updating
        //@ts-ignore
        JSON.stringify(data),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      history.push("/" + auth.userId + "/projects");
    } catch (err) {}
  };

  return (
    <div className="max-w-[40%] ">
      <h1 className="mb-4 text-2xl font-bold text-gray-500 uppercase ">
        Update Project
      </h1>
      {/* {error && <p>{error}</p>} */}
      <FormProvider {...methods}>
        {isLoading && loadedData && <LoadingSpinner asOverlay />}
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <Input label="Name" name="projectName" inputType="input" />
          <Input label="Description" name="description" inputType="textarea" />
          <div className="flex items-center justify-start gap-4 mt-8">
            <Link to={"/" + auth.userId + "/projects"}>
              <Button className="text-gray-600 bg-gray-200">Cancel</Button>
            </Link>
            <Button type="submit" className="text-white bg-primary">
              Update Project
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateProject;
