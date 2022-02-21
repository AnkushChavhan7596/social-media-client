import React from "react";
import "./Loader.css";
import LoaderImg from "../../Assets/Images/Dual Ball-1s-200px (1).gif";

const Loader = () =>{
    return(
        <>
          <div className="loader">
              <img src={LoaderImg} alt="img" />
          </div>
        </>
    )
}

export default Loader;