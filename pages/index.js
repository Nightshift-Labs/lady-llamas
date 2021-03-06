import dynamic from "next/dynamic";

const Header = dynamic(() => import("../components/header"));
const MintSection = dynamic(() => import("../components/mint-section"));

const Home = () => {
  return (
    <>
      <Header title="Mint Your Lady Llama | Lady Llamas" />
      <MintSection />
    </>
  );
};

export default Home;
