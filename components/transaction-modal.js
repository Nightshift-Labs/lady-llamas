import Modal from "react-modal";
import { TRANSACTION_STATUS } from "../utils/constants";
import { Loader } from "./icons";

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "550px",
    height: "350px",
    border: "none",
    padding: "0",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "transparent",
  },

  overlay: {
    background: "rgb(14, 16, 62, 0.8)",
    zIndex: "5",
  },
};

Modal.setAppElement("body");

const TransactionModal = ({ isOpen, closeModal, transactionStatus }) => {
  const getTitle = (transactionStatus) => {
    switch (transactionStatus) {
      case TRANSACTION_STATUS.IN_PROGRESS:
        return (
          <div className="flex flex-col text-5xl font-black text-center pb-8 md:text-4xl md:pb-1">
            <span className="outline-title">MINTING YOUR</span> LADY LLAMA
          </div>
        );
      case TRANSACTION_STATUS.SUCCESS:
        return (
          <div className="text-5xl font-black text-center md:text-3xl">
            MINTING COMPLETE
          </div>
        );
      case TRANSACTION_STATUS.FAILED:
        return (
          <div className="text-5xl font-black text-center md:text-3xl ">
            MINTING FAILED
          </div>
        );
    }
  };

  const getTransactionStatusIcon = (transactionStatus) => {
    switch (transactionStatus) {
      case TRANSACTION_STATUS.IN_PROGRESS:
        return <Loader />;
      case TRANSACTION_STATUS.SUCCESS:
        return <div className="success-image"></div>;
      case TRANSACTION_STATUS.FAILED:
        return <div className="error-image"></div>;
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div className="modal flex flex-col justify-center space-y-6">
        <h3>{getTitle(transactionStatus)}</h3>
        <div className="m-auto">
          {getTransactionStatusIcon(transactionStatus)}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
