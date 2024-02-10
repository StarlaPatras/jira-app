// Components
import { useEffect } from "react";
import ColumnItem from "./ColumnItem";
interface Tickets {
  columnId: string;
  content: string;
  creator: string;
  _id: string;
}

interface Column {
  name: string;
  _id: string;
  projectId: string;
  tickets: Tickets[];
}

interface ColumProps {
  items: Column[];
  onSelectedColumnId: (id: string) => void;
  createdTicket: (content: string, id: string) => void;
  // ticketData: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveTicket: (id: string, columnId: string) => void;
  prevTicket: (id: string, columnId: string) => void;
  onUpdateTicket: (content: string, id: string) => void;
}

const ColumnList: React.FC<ColumProps> = ({
  items,
  onSelectedColumnId,
  createdTicket,
  // ticketData,
  onDelete,
  onMoveTicket,
  prevTicket,
  onUpdateTicket,
}) => {
  const firstColumnId = items.length > 0 ? items[0]._id : "";
  console.log(">>firstColumnId", firstColumnId);

  useEffect(() => {
    onSelectedColumnId(firstColumnId);
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto">
      {items.map((c, i) => (
        <div className="flex-1 gap-3 flex-item " key={c._id}>
          <ColumnItem
            name={c.name}
            id={c._id}
            index={i}
            ColumnId={onSelectedColumnId}
            createdTicket={createdTicket}
            ticketItems={c.tickets}
            onDelete={onDelete}
            onMove={onMoveTicket}
            prevTicket={prevTicket}
            onUpdateTicket={onUpdateTicket}
            isFirstColumn={i === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default ColumnList;
