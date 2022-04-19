import Link from "next/link";

import { Discord, Twitter, OpenSea } from "./icons";

const Footer = () => {
  return (
    <nav className="absolute inset-x-0 bottom-0 h-16 z-10">
      <div className="container flex justify-between items-center w-full">
        <div>
          <Link href="/">
            <a title=""></a>
          </Link>
        </div>
        <ul className=" flex flex-row items-center flex space-x-5">
          <li>
            <a
              href={process.env.OPENSEA_LINK}
              title="View on OpenSea"
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenSea />
              OPENSEA
            </a>
          </li>
          <li>
            <a
              href=""
              title="Follow Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
              TWITTER
            </a>
          </li>
          <li>
            <a
              href=""
              title="Join Discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord />
              DISCORD
            </a>
          </li>
          <li>
            <a
              href=""
              title="Contract"
              target="_blank"
              rel="noopener noreferrer"
            />
            CONTRACT
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Footer;
