import React from "react";
import "../css/About.css";
import tarang from "../../src/images/tarang.jpg";
import yagay from "../../src/images/yagay.jpeg";
import tanmay from "../../src/images/tanmay.jpg";
import priyansh from "../../src/images/priyansh.jpeg";
export default function About() {
  return (
    <>
      <div className="allmem">
        <div className="mem1">
          <div className="cont1">
            <img src={priyansh} alt="" className="priimg" />
            <p>Priyansh Singhal</p>
          </div>
          <div className="cont2">
            <img src={tarang} alt="" className="tarimg" />
            <p>Tarang Verma</p>
          </div>
        </div>
        <div className="mem3">
          <div className="cont3">
            <img src={yagay} alt="" className="yagimg" />
            <p>Yagay Khatri</p>
          </div>
          <div className="cont4 ">
            <img src={tanmay} alt="" className="tanimg" />
            <p> Tanmay Sachan</p>
          </div>
        </div>
      </div>
    </>
  );
}
