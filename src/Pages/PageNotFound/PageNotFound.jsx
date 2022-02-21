import React from 'react';
import "./PageNotFound.css";
import { Link } from "react-router-dom";
 

const PageNotFound = () =>{
    return(
        <>
            <div className="pageNotFound">
               <div className="page_not_found_wrapper">
                   <h1 className='main_heading'>Page Not Found</h1>
                   <Link to="/" className='back_to_home_btn'>Back to Home</Link>
               </div>

            </div>
        </>
    )
}

export default PageNotFound;
