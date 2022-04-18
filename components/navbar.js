import Link from "next/link";
import Image from "next/image";

import { Discord, Twitter, OpenSea } from "./icons";
import WalletConnector from "./wallet-connector";

const Navbar = () => {
  return (
    <nav>
      <div>
        <div>
          <Link href="/">
            <a title="Lady Llamas">
              <Image
                src="/logo.svg"
                alt="Lady Llamas"
                width="171"
                height="56px"
                priority
              />
            </a>
          </Link>
        </div>
        <ul>
          <li>
            <WalletConnector />
          </li>
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
              href=""
              title="Follow Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
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
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
