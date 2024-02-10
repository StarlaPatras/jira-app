import { useEffect } from "react";

// Components

import Tickets from "../../ticket/components/Tickets";

interface Tickets {
  columnId: string;
  content: string;
  creator: string;
  _id: string;
}

interface ColumnItemProps {
  name: string;
  id: string;
  index: number;
  isFirstColumn: boolean;

  ColumnId: (id: string) => void;
  createdTicket: (content: string, id: string) => void;
  ticketItems: Tickets[];
  onDelete: (id: string) => void;
  onMove: (id: string, columnId: string) => void;
  prevTicket: (id: string, columnId: string) => void;
  onUpdateTicket: (content: string, id: string) => void;
}

const ColumnItem: React.FC<ColumnItemProps> = ({
  name,
  id,
  index,
  ColumnId,
  prevTicket,
  createdTicket,
  isFirstColumn,
  ticketItems,
  onDelete,
  onMove,
  onUpdateTicket,
}) => {
  console.log(">>isFirstColumn", isFirstColumn);

  return (
    <div className="p-4 bg-gray-100 rounded-[2px] shadow-lg gap-8 mt-[3%]">
      <h1 className="text-base font-semibold text-gray-500 uppercase">
        {name}
      </h1>
      <div>
        <Tickets
          id={id}
          index={index}
          showTicket
          createdTicket={createdTicket}
          ticketItems={ticketItems}
          onDelete={onDelete}
          onMove={onMove}
          prevTicket={prevTicket}
          // columnId={ColumnId}
          onUpdateTicket={onUpdateTicket}
          isFirstColumn={isFirstColumn}
        />
      </div>
    </div>
  );
};

export default ColumnItem;
