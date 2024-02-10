import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// React-hook-form
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Shared Components
import Layout from "../../../shared/Layout/Dashboard";
import Input from "../../../shared/FormElements/Input";
import Button from "../../../shared/FormElements/Button";
import LoadingSpinner from "../../../shared/UlElements/Loader";

// Hooks
import { useHttpClient } from "../../../hooks/Http-hook";

// Context
import { AuthContext } from "../../../context/AuthContext";

interface FormData {
  content: string;
}
interface RouteParams {
  ticketId: string;
}

const schema = yup.object().shape({
  content: yup.string().required("Project Name is required"),
});
const UpdatedTicket = () => {
  const [loadedData, setLoadedData] = useState();
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { error, isLoading, sendReq } = useHttpClient();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { handleSubmit, reset, setValue } = methods;
  const { ticketId } = useParams<RouteParams>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendReq(
          `http://localhost:4000/api/ticket/${ticketId}`,
          "GET"
        );
        setLoadedData(responseData.ticket);
        setValue("content", responseData.ticket.content);
      } catch (err) {}
    };
    fetchData();
  }, [sendReq, ticketId, setValue]);

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    reset();

    try {
      await sendReq(
        `http://localhost:4000/api/ticket/${ticketId}`,
        "PATCH",
        // @ts-ignore
        JSON.stringify(data),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      //   history.push(`/projects/${auth.projectId}/tickets`);
    } catch (err) {}
  };

  return (
    <Layout>
      {error && <p>{error}</p>}
      <FormProvider {...methods}>
        {isLoading && loadedData && <LoadingSpinner asOverlay />}
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Input name="content" inputType="textarea" label="Content" />
          <Button className="text-white bg-primary">UpdateTicket</Button>
        </form>
      </FormProvider>
    </Layout>
  );
};

export default UpdatedTicket;
