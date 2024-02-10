import React, { useState } from "react";

// Shared Component
import Modal from "../../shared/UlElements/Modal";

const MainComponent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <button onClick={openModal} className="bg-red-600">
        Open Modal
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>This is a Modal</h2>
        <p>Modal content goes here.</p>
      </Modal>
    </div>
  );
};

export default MainComponent;
