import dynamic from "next/dynamic";

const Header = dynamic(() => import("../components/header"));
const MintSection = dynamic(() => import("../components/mint-section"));

const Home = () => {
  return (
    <div>
      <Header title="Lady Llamas" />
      <MintSection />
    </div>
  );
};

export default Home;
