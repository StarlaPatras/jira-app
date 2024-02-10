import ReactDOM from "react-dom";
import { Error, Cancel } from "../Icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalType?: "error" | "column" | "delete";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  modalType,
}) => {
  if (!isOpen) return null;

  const portalContainer = document.getElementById("portal");

  if (!portalContainer) {
    console.error("Target container 'portal' not found in the DOM.");
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <div className="overlay">
        <div className="modal-content">
          {modalType === "error" ? (
            // Error modal
            <div className="flex flex-col items-center justify-center">
              <Error size={50} color="red" />
              <p className="py-3 text-[26px]">Oh snap!</p>

              <p className="pb-5 text-lg">{children}</p>
              <div
                className="flex items-center justify-center w-full py-4 bg-red-500 cursor-pointer"
                onClick={onClose}
              >
                <button className="text-white">Dismiss</button>
              </div>
            </div>
          ) : modalType === "column" ? (
            // Column modal
            <div className="p-4">
              <button onClick={onClose} className="close">
                <Cancel color="#F44336" size={20} />
              </button>
              <div>{children}</div>
            </div>
          ) : modalType === "delete" ? (
            // Custom modal (add your custom UI here)
            <div className="flex flex-col items-center justify-center">
              <div className="close" onClick={onClose}>
                <Cancel size={20} color="red" />
              </div>
              <p className="py-3 text-[26px]">Are You Sure?</p>

              <div>{children}</div>
              {/* <div
                className="flex items-center justify-center w-full py-4 bg-red-500 cursor-pointer"
                onClick={onClose}
              >
                <button className="text-white">Dismiss</button>
              </div> */}
            </div>
          ) : (
            // Default case (unknown modalType)
            <div>Unknown modalType: {modalType}</div>
          )}
        </div>
      </div>
    </>,
    portalContainer
  );
};

export default Modal;
