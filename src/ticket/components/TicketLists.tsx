import { useEffect } from "react";

// Components
import TicketItem from "./TicketItem";

interface Tickets {
  columnId: string;
  content: string;
  creator: string;
  _id: string;
}

interface TicketListProps {
  ticketItems: Tickets[];
  onDeleteTicket: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
  prevTicket: (id: string, columnId: string) => void;
  onUpdateTicket: (content: string, id: string) => void;
  firstColumn: boolean;
}

const TicketList: React.FC<TicketListProps> = ({
  ticketItems,
  onDeleteTicket,
  onMove,
  prevTicket,
  firstColumn,

  onUpdateTicket,
}) => {
  console.log("ticketItems", ticketItems);
  return (
    <>
      {ticketItems.map((t) => (
        <TicketItem
          key={t._id}
          content={t.content}
          id={t._id}
          columnId={t.columnId}
          prevTicket={prevTicket}
          onDelete={onDeleteTicket}
          firstColumn={firstColumn}
          onMove={onMove}
          onUpdateTicket={onUpdateTicket}
        />
      ))}
    </>
  );
};

export default TicketList;
