import { useContext } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";

import { connectors } from "../utils/connectors";
import { WalletModalContext } from "../layout/page";

const customStyles = {
  content: {
    width: "90%",
    maxWidth: "300px",
    height: "400px",
    border: "none",
    padding: "",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "#3F4A99",
  },

  overlay: {
    background: "rgb(14, 16, 62, 0.8)",
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
      <h3 className="font-bold text-2xl text-center py-6 border-b-2 border-[#AEB0D5]">
        Connect to Wallet
      </h3>
      <div className="font-bold text-xl text-center py-5 border-b-2 border-[#AEB0D5]">
        <button
          onClick={() => {
            activate(connectors.coinbaseWallet);
            setProvider(connectors.chainNames.coinbaseWallet);
            closeModal();
          }}
        >
          <div className="flex flex-row space-x-2">
            <div>
              <Image
                src="/wallet-icons/cbw.png"
                alt="Coinbase Wallet Logo"
                width={25}
                height={25}
                borderradius="3px"
              />
            </div>
            <div>Coinbase Wallet</div>
          </div>
        </button>{" "}
      </div>
      <div className="font-bold text-xl text-center py-5 border-b-2 border-[#AEB0D5]">
        <button
          onClick={() => {
            activate(connectors.walletConnect);
            setProvider(connectors.chainNames.walletConnect);
            closeModal();
          }}
        >
          <div className="flex flex-row space-x-2">
            <div>
              <Image
                src="/wallet-icons/wc.png"
                alt="Wallet Connect Logo"
                width={25}
                height={25}
                borderradius="3px"
              />
            </div>
            <div>Wallet Connect</div>
          </div>
        </button>{" "}
      </div>
      <div className="font-bold text-xl text-center py-5 border-b-2 border-[#AEB0D5]">
        <button
          onClick={() => {
            activate(connectors.injected);
            setProvider(connectors.chainNames.injected);
            closeModal();
          }}
        >
          <div className="flex flex-row space-x-2">
            <div>
              <Image
                src="/wallet-icons/mm.png"
                alt="Metamask Logo"
                width={25}
                height={25}
                borderradius="3px"
              />
            </div>
            <div>Metamask</div>
          </div>
        </button>{" "}
      </div>
      <div className="font-bold text-md text-center mx-auto py-2 mt-6 w-1/2 border-2 border-[#AEB0D5] rounded-full">
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
