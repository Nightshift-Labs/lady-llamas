import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../components/navbar"));

const Page = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Page;
