import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () =>{
    const navigate = useNavigate();

    const [userVerified , setUserVerified] = useState(false);

    useEffect(()=>{
        const token = Cookies.get("jwt");
        if(token){
           axios.post("http://localhost:8000/check_user", {token: Cookies.get("jwt")}).then((res)=>{
 
              if(res.status === 200 && res.data.isAuth){
                  console.log(res.data.msg);
                  setUserVerified(true);
              }
              else{
                  Swal.fire(
                      "Oops",
                      res.data.msg,
                      "info"
                  )

                  setUserVerified(false);

                  navigate("/login", {replace : true});
              }
             
           })

        }
        else{
            // Swal.fire(
            //     "Oops",
            //     "Login first",
            //     "info"
            // )

            setUserVerified(false);

            navigate("/login", {replace : true});
        }

    }, [])



    return(
        <div>
            { userVerified ? <Outlet /> : navigate("/login", {replace : true})}
        </div>
    )
}

export default PrivateRoute;