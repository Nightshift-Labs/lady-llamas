import { useState, createContext } from "react";
import dynamic from "next/dynamic";

export const WalletModalContext = createContext(null);

const Navbar = dynamic(() => import("../components/navbar"));
const Footer = dynamic(() => import("../components/footer"));
const WalletModal = dynamic(() => import("../components/wallet-modal"));

const Page = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <WalletModalContext.Provider
        value={{
          isOpen,
          setIsOpen,
          closeModal,
        }}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WalletModal />
      </WalletModalContext.Provider>
    </div>
  );
};

export default Page;
