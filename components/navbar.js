import Link from "next/link";
import Image from "next/image";

import { Discord, Twitter, OpenSea } from "./icons";
import WalletConnector from "./wallet-connector";

const Navbar = () => {
  return (
    <nav className="absolute inset-x-0 top-0 h-16 z-10">
      <div className="container flex justify-between items-center w-full">
        <div className="py-7 md:py-3 sm:w-40">
          <Link href="/">
            <a title="Lady Llamas">
              <Image
                src="/logo.svg"
                alt="Lady Llamas"
                width="196"
                height="56px"
                priority
              />
            </a>
          </Link>
        </div>
        <ul>
          <div className="sm:hidden md:hidden">
            <li>
              <WalletConnector />
            </li>
          </div>
          <div className="lg:hidden xl:hidden 2xl:hidden md:flex flex flex-row items-center space-x-3">
            <li>
              <a
                href={process.env.OPENSEA_LINK}
                title="View on OpenSea"
                target="_blank"
                rel="noopener noreferrer"
              >
                <OpenSea />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/LaidBackLlamas"
                title="Follow Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter />
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/invite/laidbackllamas"
                title="Join Discord"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Discord />
              </a>
            </li>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
