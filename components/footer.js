import Link from "next/link";

import { Discord, Twitter, OpenSea } from "./icons";

const Footer = () => {
  return (
    <nav className="absolute inset-x-0 bottom-0 h-16 z-10 lg:hidden">
      <div className="container flex justify-between items-center w-full">
        <div>
          <Link href="/">
            <a title=""></a>
          </Link>
        </div>
        <ul className=" flex flex-row items-center space-x-8">
          <li>
            <a
              className="flex flex-row text-lightPurple font-bold text-sm"
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
              className="flex flex-row text-lightPurple font-bold text-sm"
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
              className="flex flex-row text-lightPurple font-bold text-sm"
              href=""
              title="Join Discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord />
              DISCORD
            </a>
          </li>
          <li className="text-lightPurple font-bold text-sm">
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
