import { useContext } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

import { connectors } from "../utils/connectors";
import { WalletModalContext } from "../layout/page";

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "550px",
    height: "300px",
    color: "black",
  },
};

Modal.setAppElement("body");

const WalletModal = ({}) => {
  const { activate } = useWeb3React();
  const { isOpen, closeModal } = useContext(WalletModalContext);

  const setProvider = (type) => {
    window.localStorage.setItem("provider", type);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
      <h3>Connect to Wallet</h3>
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
            borderradius="3px"
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
            borderradius="3px"
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
            borderradius="3px"
          />
          Metamask
        </button>{" "}
      </div>
      <div>
        <button
          onClick={() => {
            closeModal();
          }}
        >
          Cancel
        </button>{" "}
      </div>
    </Modal>
  );
};

export default WalletModal;
