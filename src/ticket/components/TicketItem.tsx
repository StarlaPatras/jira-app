import React, { useContext, useState } from "react";

// React-hook-form
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Hooks
import { useHttpClient } from "../../hooks/Http-hook";

// Context
import { AuthContext } from "../../context/AuthContext";

// Shared Components
import { Delete, Edit } from "../../shared/Icons";
import Modal from "../../shared/UlElements/Modal";
import Input from "../../shared/FormElements/Input";
import Button from "../../shared/FormElements/Button";
import LoadingSpinner from "../../shared/UlElements/Loader";
import { NextArrow, PrevArrow } from "../../shared/Icons";

interface TicketItemProps {
  content: string;
  id: string;
  columnId: string;
  onDelete: (id: string) => void;
  firstColumn: boolean;
  onMove: (id: string, columnId: string) => void;
  prevTicket: (id: string, columnId: string) => void;

  onUpdateTicket: (content: string, id: string) => void;
}

interface FormData {
  content: string;
}

const schema = yup.object().shape({
  content: yup.string().required("This is required"),
});

const TicketItem: React.FC<TicketItemProps> = ({
  content,
  id,
  onDelete,
  columnId,
  firstColumn,
  prevTicket,
  onMove,
  onUpdateTicket,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);

  const [loadedData, setLoadedData] = useState();
  const auth = useContext(AuthContext);
  const { error, isLoading, sendReq } = useHttpClient();

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset, setValue } = methods;

  const deleteTicketHandler = async () => {
    try {
      await sendReq(
        `https://team-forge-backend-zdrga.ondigitalocean.app/api/ticket/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      onDelete(id);
      setOpenErrorModal(false);
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const nextHandler = async () => {
    onMove(id, columnId);
  };

  const prevHandler = async () => {
    prevTicket(id, columnId);
  };

  // const fetchData = async () => {
  //   try {
  //     const responseData = await sendReq(
  //       `https://team-forge-backend-zdrga.ondigitalocean.app/api/ticket/${id}`,
  //       "GET"
  //     );
  //     setLoadedData(responseData.ticket);
  //     setValue("content", responseData.ticket.content);
  //   } catch (err) {}
  // };

  const fetchData = async () => {
    try {
      const responseData = await sendReq(
        `https://team-forge-backend-zdrga.ondigitalocean.app/api/ticket/${id}`,
        "GET"
      );

      if (responseData.ticket) {
        setLoadedData(responseData.ticket);
        setValue("content", responseData.ticket.content);
      }
    } catch (err) {
      console.error("Error fetching ticket data:", err);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    onUpdateTicket(data.content, id);
    fetchData();
    reset();
    // try {
    //   await sendReq(
    //     `https://team-forge-backend-zdrga.ondigitalocean.app/api/ticket/${id}`,
    //     "PATCH",
    //     // @ts-ignore
    //     JSON.stringify({
    //       content: data.content,
    //     }),
    //     {
    //       "Content-Type": "application/json",
    //     }
    //   );
    //   await reset();

    //   // Fetch updated data
    //   // await fetchData();

    //   setOpenModal(false);
    // } catch (err) {}
  };
  // useEffect(() => {
  //   fetchData();
  // }, [sendReq, id]);
  return (
    <>
      {/* {error && <p>{error}</p>} */}
      {isLoading && <LoadingSpinner asOverlay />}
      <div className=" w-full relative  rounded-md p-[13px] my-3 shadow-md border bg-white ">
        <div className="flex justify-between">
          <p className="text-[17px] text-gray-800 mr-4">{content}</p>
          <div className="flex gap-3 cursor-pointer">
            <div onClick={() => setOpenModal(true)}>
              <Edit size={20} color="#161616" />
            </div>

            <div onClick={() => setOpenErrorModal(true)}>
              <Delete size={20} color="#F44336" />
            </div>
            <Modal
              modalType="delete"
              isOpen={openErrorModal}
              onClose={() => setOpenErrorModal(false)}
            >
              <p className="mb-6 text-center">
                Do you really want to delete this ticket? This process cannot be
                undone
              </p>
              <div className="flex items-center justify-center gap-5 pb-[30px]">
                <Button
                  className="text-gray-600 transition-all bg-gray-200 hover:bg-gray-300"
                  onClick={() => setOpenErrorModal(false)}
                >
                  Cancel
                </Button>
                {/* <Button onClick={deleteTicketHandler} variant="danger">
                  Delete
                </Button> */}
                <Button
                  onClick={deleteTicketHandler}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </Modal>
          </div>
          <Modal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            modalType="column"
          >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Ticket Summary"
                  name="content"
                  inputType="input"
                />

                <div className="flex items-center justify-start gap-5 mt-3">
                  <Button
                    className="text-gray-600 transition-all bg-gray-200 hover:bg-gray-300"
                    onClick={() => setOpenModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="text-white transition-all bg-primary hover:bg-primary_light">
                    Update
                  </Button>
                </div>

                {/* <Button variant="header">Update</Button> */}
              </form>
            </FormProvider>
          </Modal>
        </div>
        <div className="flex gap-2 ">
          {!firstColumn && (
            <button
              onClick={prevHandler}
              className="flex items-center justify-center text-[13px] gap-1 p-1 mt-3 bg-primary transition-all text-white hover:bg-primary_light"
            >
              Previous
              <PrevArrow size={20} color="#fff" />
            </button>
          )}
          <button
            onClick={nextHandler}
            className="flex items-center justify-center gap-1 text-[13px] p-1 mt-3 transition-all bg-primary text-white hover:bg-primary_light"
          >
            Next
            <NextArrow size={20} color="#fff" />
          </button>
        </div>
      </div>
    </>
  );
};

export default TicketItem;
