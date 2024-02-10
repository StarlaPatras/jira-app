import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

// React-hook-form
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Hooks
import { useHttpClient } from "../../../hooks/Http-hook";

// Context
import { AuthContext } from "../../../context/AuthContext";

// Shared Component
import Input from "../../../shared/FormElements/Input";
import Button from "../../../shared/FormElements/Button";
import LoadingSpinner from "../../../shared/UlElements/Loader";

interface FormData {
  projectName: string;
  description: string;
}

const schema = yup.object().shape({
  projectName: yup.string().required("Project Name is required"),
  description: yup.string().required("Description is required"),
});

const NewProject = () => {
  const auth = useContext(AuthContext);
  const { error, isLoading, sendReq } = useHttpClient();
  const history = useHistory();
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  console.log("token>>", auth.token);

  const { handleSubmit, reset } = methods;

  // const onSubmit: SubmitHandler<FormData> = async (data) => {
  //   try {
  //     const responseData = await sendReq(
  //       "http://localhost:4000/api/project",
  //       "POST",
  //       // @ts-ignore
  //       JSON.stringify({
  //         projectName: data.projectName,
  //         description: data.description,
  //         creator: auth.userId,
  //       }),
  //       { Authorization: "Bearer " + auth.token }
  //     );

  //     auth.isProject(responseData.project.id);

  //     history.push(`/${auth.userId}/projects`);
  //   } catch (err) {}
  //   reset();
  // };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log("Request Data:", {
        projectName: data.projectName,
        description: data.description,
        creator: auth.userId,
      });

      const responseData = await sendReq(
        "http://localhost:4000/api/project",
        "POST",
        // @ts-ignore
        JSON.stringify({
          projectName: data.projectName,
          description: data.description,
          creator: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      console.log("Response Data:", responseData);

      auth.isProject(responseData.project.id);
      history.push(`/${auth.userId}/projects`);
    } catch (err) {
      console.error("Error:", err);
    }
    reset();
  };

  return (
    <div className="max-w-[40%] ">
      {error && <p className="p-6 bg-red-600">{error}</p>}
      <h1 className="mb-4 text-2xl font-bold text-gray-500 uppercase ">
        add project details
      </h1>

      <p className="mb-4">
        Explore what's possible when you collaborate with your team. Edit
        project details anytime in project.
      </p>
      <FormProvider {...methods}>
        {isLoading && <LoadingSpinner asOverlay />}
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <Input label="Name" inputType="input" name="projectName" />
          <Input label="Description" inputType="textarea" name="description" />
          <div className="flex items-center justify-start gap-4 mt-8">
            <Link to={"/" + auth.userId + "/projects"}>
              {/* <Button variant="cancel">Cancel</Button> */}
              <Button className="text-gray-600 bg-gray-200">Cancel</Button>
            </Link>
            <Button type="submit" className="text-white bg-primary">
              Create
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewProject;
