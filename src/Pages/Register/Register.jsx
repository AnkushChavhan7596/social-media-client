import React, { useState } from 'react';
import "./Register.css";
import SideImg from "../../Assets/Images/undraw_voice_control_ofo1.svg";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {

    const navigate = useNavigate();

    const [passwordStyle, setPasswordStyle] = useState("fas fa-eye-slash");
    const [passwordType, setPasswordType] = useState("password");

    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const handelChange = (e) => {
        const { name, value } = e.target; // destructuring

        setUser({
            ...user,
            [name]: value
        })
    }



    // sending data to the backend for registration
    const postUser = async () => {
        try {
            const res = await axios.post("http://localhost:8000/register", user);

            if (res.status === 200) {
                Swal.fire(
                    "Great",
                    res.data.msg,
                    "success"
                );

                navigate("/login", { replace: true });
            }
            else {
                navigate("/register", { replace: true });
                Swal.fire(
                    "Oops !!",
                    res.data.msg,
                    "info"
                )

            }

        }
        catch (err) {
            Swal.fire(
                "Oops !!",
                err.message,
                "info"
            )

            navigate("/register", { replace: true });
            console.log(err);

        }
    }


    // handle password seen
    const handlePasswordSeen = () => {

        if (passwordStyle === "fas fa-eye-slash") {
            setPasswordStyle("far fa-eye");
            setPasswordType("text");
        }
        else {
            setPasswordStyle("fas fa-eye-slash");
            setPasswordType("password");
        }
    }

    const handleValidation = (e) =>{
        e.preventDefault();
    }


    return (
        <>
            <div className="register">
                <form onSubmit={handleValidation}>
                    <div className="register_wrapper">

                        <div className="left_div">
                            <div className="heading">
                                <h2>Register</h2>
                            </div>

                            <div className="input_field">
                                <input type="text" name="name" onChange={handelChange} value={user.name} placeholder='Enter your name' />
                            </div>

                            <div className="input_field">
                                <input type="text" name="username" onChange={handelChange} value={user.username} placeholder='Enter username' />
                            </div>

                            <div className="input_field">
                                <input type="email" name="email" onChange={handelChange} value={user.email} placeholder='Enter your email' />
                            </div>

                            <div className="input_field">

                                <i className={`${passwordStyle} password_eye`} onClick={handlePasswordSeen}></i>
                                {/* <i class="far fa-eye open_eye"></i> */}

                                <input type={passwordType} name="password" onChange={handelChange} value={user.password} placeholder='Enter password' />
                            </div>

                            <div className="btn__cont">
                                <p onClick={postUser}>Register</p>
                            </div>

                            <div className="dont_have_account">
                                <Link to="/login">Already have an account ?</Link>
                            </div>
                        </div>


                        <div className="right_div">
                            <div className="img__container">
                                <img src={SideImg} alt="" />
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}

export default Register;