import Link from "next/link";

import { Discord, Twitter, OpenSea } from "./icons";

const Footer = () => {
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
