import Modal from "react-modal";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

import { connectors } from "../utils/connectors";

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "550px",
    height: "300px",
  },
};

Modal.setAppElement("body");

const WalletModal = ({ isOpen, closeModal }) => {
  const { activate } = useWeb3React();

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <div>
        <button
          onClick={() => {
            activate(connectors.coinbaseWallet);
            setProvider(connectors.chainNames.coinbaseWallet);
            closeModal();
          }}
        >
          <Image
            src="/wallet-icons/cbw.png"
            alt="Coinbase Wallet Logo"
            width={25}
            height={25}
            borderRadius="3px"
          />
          Coinbase Wallet
        </button>{" "}
      </div>
      <div>
        <button
          onClick={() => {
            activate(connectors.walletConnect);
            setProvider(connectors.chainNames.walletConnect);
            closeModal();
          }}
        >
          <Image
            src="/wallet-icons/wc.png"
            alt="Wallet Connect Logo"
            width={25}
            height={25}
            borderRadius="3px"
          />
          Wallet Connect
        </button>{" "}
      </div>
      <div>
        <button
          onClick={() => {
            activate(connectors.injected);
            setProvider(connectors.chainNames.injected);
            closeModal();
          }}
        >
          <Image
            src="/wallet-icons/mm.png"
            alt="Metamask Logo"
            width={25}
            height={25}
            borderRadius="3px"
          />
          Metamask
        </button>{" "}
      </div>
    </Modal>
  );
};

export default WalletModal;
