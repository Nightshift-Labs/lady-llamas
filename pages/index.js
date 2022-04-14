import dynamic from "next/dynamic";

const MintSection = dynamic(() => import("../components/mint-section"));

const Home = () => {
  return (
    <div>
      <h1>Lady Llamas</h1>
      <MintSection />
    </div>
  );
};

export default Home;
