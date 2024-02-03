import React from "react";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav>
        <div className="mainlogo">
          <Link className="logo" to="/">
            EmoTunes
          </Link>
        </div>
        <div className="elements">
          <Link className="ele1" to="/">
            EmoFind
          </Link>
          <Link className="ele2" to="/About">
            About us
          </Link>
        </div>
      </nav>
    </div>
  );
}
