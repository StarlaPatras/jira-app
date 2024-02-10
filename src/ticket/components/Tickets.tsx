import React, { useContext, useEffect, useState } from "react";

// React-hook-form
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Components
import TicketLists from "./TicketLists";

// hook
import { useHttpClient } from "../../hooks/Http-hook";

// context
import { AuthContext } from "../../context/AuthContext";

// Shared Components
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import { Add, Cancel, Check } from "../../shared/Icons";
import LoadingSpinner from "../../shared/UlElements/Loader";

interface Ticket {
  content: string;
  columnId: string;
  creator: string;
  _id: string;
}

interface TicketsProps {
  id: string;
  createdTicket: (content: string, id: string) => void;
  // ticketData: (id: string) => void;
  ticketItems: Ticket[];
  onDelete: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
  onUpdateTicket: (content: string, id: string) => void;
  prevTicket: (content: string, id: string) => void;

  showTicket: boolean;
  index: number;
  // columnId: (id: string) => void;
  isFirstColumn: boolean;
}

interface FormData {
  content: string;
}

const schema = yup.object().shape({
  content: yup.string().required("Write something in ticket"),
});
const Tickets: React.FC<TicketsProps> = ({
  id,
  createdTicket,
  // ticketData,
  ticketItems,
  index,
  prevTicket,
  onDelete,
  onMove,
  // columnId,
  onUpdateTicket,
  isFirstColumn,
}) => {
  const [showTextarea, setShowTextarea] = useState(false);
  const [loadedData, setLoadedData] = useState<Ticket[]>();
  const methods = useForm<FormData>({ resolver: yupResolver(schema) });
  const { handleSubmit, reset } = methods;
  const auth = useContext(AuthContext);

  const { error, isLoading, sendReq } = useHttpClient();

  const handleButtonClick = () => {
    setShowTextarea(true);
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    createdTicket(data.content, id);
    setShowTextarea(false);

    reset();
  };

  return (
    <div>
      {isFirstColumn && (
        <Button
          onClick={handleButtonClick}
          className="my-3 text-gray-600 bg-blue-200"
        >
          Create Issue
        </Button>
      )}
      {isFirstColumn && (
        <FormProvider {...methods}>
          {isLoading && <LoadingSpinner asOverlay />}
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            {showTextarea && <Input inputType="textarea" name="content" />}
            {showTextarea && (
              <div className="flex items-center justify-start gap-3 mb-7">
                <button>
                  <Check color="green" />
                </button>
                <div
                  onClick={() => setShowTextarea(false)}
                  className="cursor-pointer"
                >
                  <Cancel color="#F44336" />
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      )}
      {ticketItems && (
        <TicketLists
          onDeleteTicket={onDelete}
          ticketItems={ticketItems}
          prevTicket={prevTicket}
          onMove={onMove}
          firstColumn={isFirstColumn}
          onUpdateTicket={onUpdateTicket}
        />
      )}
    </div>
  );
};

export default Tickets;
