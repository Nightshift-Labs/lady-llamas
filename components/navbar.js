import Image from "next/image";
import Link from "next/link";

import { Discord, Twitter, OpenSea } from "./icons";
import WalletConnector from "./wallet-connector";

const Navbar = () => {
  return (
    <nav>
      <div>
        <div>
          <Link href="/">
            <a title=""></a>
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
              title="Join Discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Discord />
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
