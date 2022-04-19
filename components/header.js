import Head from "next/head";

const Header = ({ ...props }) => {
  const { title } = props;

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content="" />
    </Head>
  );
};

export default Header;
