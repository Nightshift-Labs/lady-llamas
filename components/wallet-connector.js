import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { connectors } from "../utils/connectors";

const WalletModal = dynamic(() => import("../components/wallet-modal"));

const WalletConnector = () => {
  const { account, activate, deactivate, active } = useWeb3React();

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) {
      activate(connectors[provider]);
    }
  }, []);

  useEffect(() => {
    console.log(active);
    getENS();
  }, [active, account]);

  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  const getENS = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const ens = await provider.lookupAddress(address);

        if (ens !== null) {
          setName(ens);
        } else {
          setName(address);
        }
      }
    } catch (e) {
      setName(account);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (active ? disconnect() : setIsOpen(true))}
      >
        {active ? (
          <span>
            {name && name.startsWith("0x")
              ? `${name.substr(0, 5)}...${name.substr(-4, 4)}`
              : name}
          </span>
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <WalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
};

export default WalletConnector;
