import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// React-hook-form
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Hooks
import { useHttpClient } from "../../hooks/Http-hook";

// Context
import { AuthContext } from "../../context/AuthContext";

// Components
import ColumnList from "../../column/components/ColumnList";

// Shared Components
import Layout from "../../shared/Layout/Dashboard";
import Button from "../../shared/FormElements/Button";
import Modal from "../../shared/UlElements/Modal";
import Input from "../../shared/FormElements/Input";
import { Add } from "../../shared/Icons";
import LoadingSpinner from "../../shared/UlElements/Loader";

interface RouteParams {
  projectId: string;
}

interface FormData {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required("This is required"),
});

const Project = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadedData, setLoadedData] = useState<any>();

  const auth = useContext(AuthContext);
  const { projectId } = useParams<RouteParams>();
  const { error, isLoading, sendReq } = useHttpClient();
  const history = useHistory();
  const methods = useForm<FormData>({ resolver: yupResolver(schema) });
  const { handleSubmit, reset } = methods;

  const openModalHandler = () => setOpenModal(true);

  const fetchColumnData = async () => {
    try {
      const responseData = await sendReq(
        `http://localhost:4000/api/column/projects/${projectId}`,
        "GET"
      );

      setLoadedData(responseData.columns);
    } catch (err) {
      console.error("Error fetching column data:", err);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await sendReq(
        "http://localhost:4000/api/column",
        "POST",
        // @ts-ignore

        JSON.stringify({
          name: data.name,
          projectId: projectId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchColumnData();
      history.push(`/projects/${projectId}/tickets`);
      reset();
      setOpenModal(false);
    } catch (err) {}
  };

  const ticketHandler = async (content: string) => {
    try {
      await sendReq(
        "http://localhost:4000/api/ticket",
        "POST",
        // @ts-ignore

        JSON.stringify({
          content: content,
          creator: auth.userId,
          columnId: selectedId,
          projectId: projectId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchColumnData();
    } catch (err) {}
  };

  const deleteHandler = async (deletedTicketId: string) => {
    //@ts-ignore
    setLoadedData((prevColumn) =>
      //@ts-ignore
      prevColumn.filter((column) => column.tickets._id !== deletedTicketId)
    );
    fetchColumnData();
  };

  const moveTicketHandler = async (id: string, columnId: string) => {
    console.log("<<loadedData>>", loadedData);

    // @ts-ignore
    const index = loadedData.findIndex((col) => col._id === columnId);
    console.log("index>>", index);

    const newIndex = index + 1;
    const colId = loadedData[newIndex]._id;
    console.log("colId", colId);

    try {
      await sendReq(
        "http://localhost:4000/api/ticket/move",
        "POST",
        // @ts-ignore
        JSON.stringify({
          ticketId: id,
          sourceColumnId: columnId,
          targetColumnId: colId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchColumnData();
      console.log("Ticket moved successfully");
    } catch (err) {
      console.error("Error moving ticket:", err);
    }
  };

  const movePreviousTicketHandler = async (id: string, columnId: string) => {
    console.log("<<loadedData>>", loadedData);

    // @ts-ignore
    const index = loadedData.findIndex((col) => col._id === columnId);
    console.log("index>>", index);

    if (index === 0) {
      console.log("Already at the first column, cannot move to previous");
      return;
    }

    const newIndex = index - 1;
    const colId = loadedData[newIndex]._id;
    console.log("colId", colId);

    try {
      await sendReq(
        "http://localhost:4000/api/ticket/move",
        "POST",
        // @ts-ignore
        JSON.stringify({
          ticketId: id,
          sourceColumnId: columnId,
          targetColumnId: colId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchColumnData();
      console.log("Ticket moved successfully");
    } catch (err) {
      console.error("Error moving ticket:", err);
    }
  };

  const updateTicketHandler = async (content: string, id: string) => {
    try {
      await sendReq(
        `http://localhost:4000/api/ticket/${id}`,
        "PATCH",
        // @ts-ignore
        JSON.stringify({
          content: content,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchColumnData();
    } catch (err) {}
  };

  useEffect(() => {
    fetchColumnData();
  }, [sendReq, projectId, selectedId]);

  const handleColumnId = (id: string) => setSelectedId(id);

  return (
    <Layout>
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        modalType="column"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label="Column Name" name="name" inputType="input" />
            <Button className="text-white bg-primary">Add Column</Button>
          </form>
        </FormProvider>
      </Modal>
      <Button
        onClick={openModalHandler}
        className="flex items-center justify-center gap-2 text-white bg-primary"
      >
        <Add />
        Add Columns
      </Button>
      {loadedData && !isLoading && (
        <ColumnList
          items={loadedData}
          onSelectedColumnId={handleColumnId}
          createdTicket={ticketHandler}
          onDelete={deleteHandler}
          onMoveTicket={moveTicketHandler}
          prevTicket={movePreviousTicketHandler}
          onUpdateTicket={updateTicketHandler}
        />
      )}
    </Layout>
  );
};

export default Project;
