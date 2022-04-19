import dynamic from "next/dynamic";

const MintSection = dynamic(() => import("../components/mint-section"));

const Home = () => {
  return (
    <>
      <MintSection />
    </>
  );
};

export default Home;
