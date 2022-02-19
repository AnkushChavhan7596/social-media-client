import React , { useState, useEffect } from 'react';
import "./EditProfile.css";
import SideImg from "../../Assets/Images/undraw_voice_control_ofo1.svg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const EditProfile = () => {

    const navigate = useNavigate();
    
    const [activeUser, setActiveUser] = useState({});


    const [user, setUser] = useState({
        name : "",
        username: "",
        email : "",
        mobile : ""
    });

    const handelChange = (e)=>{
        const { name , value } = e.target; // destructuring

        setUser({
            ...user,
            [name] : value
        })
    }



    // sending data to the backend for registration
    const updateUser = async ()=>{
        try{
            const res = await axios.post("http://localhost:8000/edit-profile", {user, token: Cookies.get("jwt")});

            if(res.status === 200){
                Swal.fire(
                      "Great",
                      "Profile Updated Successfully",
                      "success"
                );

                navigate("/", {replace : true});
            }
            else{
               Swal.fire(
                   "Oops !!",
                   res.data.msg,
                    "info"
               )

               navigate("/edit-profile", {replace : true});
            }

        }
        catch(err){
            Swal.fire(
                "Oops !!",
                err.message,
                 "info"
            )

            navigate("/edit-profile", {replace : true});
            console.log(err);
            
        }
    }

    ///////////////////////////////////
    /////////// load active user
    const loadActiveUser = async () =>{
        try{
            const res = await axios.post("http://localhost:8000/get_active_user_by_token", {token : Cookies.get("jwt")});

            if(res.status === 200){
                console.log(res.data.activeUser)
                setUser({
                    name : res.data.activeUser.name,
                    email : res.data.activeUser.email,
                    username : res.data.activeUser.username,
                    mobile : res.data.activeUser.mobile,
                })
              
            }

        }catch(error){
           console.log(error);
        }
    }

    // load user
    useEffect(() => {
        loadActiveUser();
       
    }, []);
    


    return (
        <>
            <div className="register">
                <div className="register_wrapper">

                    <div className="left_div">
                        <div className="heading">
                            <h2>Edit Profile</h2>
                        </div>

                        <div className="input_field">
                            <input type="text" name="name" onChange={ handelChange } value={user.name} placeholder='Enter your name' />
                        </div>

                        <div className="input_field">
                            <input type="text" name="username" onChange={ handelChange } value={user.username} placeholder='Enter username' />
                        </div>

                        <div className="input_field">
                            <input type="email" name="email" onChange={ handelChange } value={user.email} placeholder='Enter your email' />
                        </div>

                        <div className="input_field">
                            <input type="tel" name="mobile" onChange={ handelChange } value={user.mobile} placeholder='Enter your mobile no.' />
                        </div>

                        <div className="btn__cont">
                           <p onClick={ updateUser }>Update</p>
                        </div>
                    </div>


                    <div className="right_div">
                           <div className="img__container">
                               <img src={SideImg} alt="" />
                           </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default EditProfile;