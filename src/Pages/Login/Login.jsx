import React ,{ useState } from 'react';
import SideImg from "../../Assets/Images/undraw_quiz_nlyh.svg";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";



const Login = () => {
    const navigate = useNavigate();

    const [passwordStyle, setPasswordStyle] = useState("fas fa-eye-slash");
    const [passwordType, setPasswordType] = useState("password");


    const [user, setUser] = useState({
        email : "",
        password : "",
    });

    const handelChange = (e)=>{
        const { name , value } = e.target; // destructuring

        setUser({
            ...user,
            [name] : value
        })
    }
    

    // ============= login user ===========
    const loginUser = async () =>{
        try{

            const res = await axios.post(`https://social-media-ankush.herokuapp.com/login`, user);

            if(res.status === 200 && res.data.token){
                console.log("Hello there")
                Cookies.set("jwt", res.data.token);

                console.log(res)

                Swal.fire(
                    "Greate",
                     res.data.msg,
                    "success"
                )

                navigate("/home", {replace : true});
               
            }
            else{
                Swal.fire(
                    "Oops",
                      res.data.msg,
                    "info"
                )

                navigate("/login", {replace : true});
            }

        }catch(error){
            Swal.fire(
                "Oops",
                 "Wrong Credentials",
                "info"
            )

            navigate("/login", {replace : true});
            console.log(error);
        }

    }

   
        // handle password seen
        const handlePasswordSeen = ()=>{

            if(passwordStyle === "fas fa-eye-slash"){
                setPasswordStyle("far fa-eye");
                setPasswordType("text");
            }
            else{
                setPasswordStyle("fas fa-eye-slash");
                setPasswordType("password");
            }
    
        }

    return (
        <>
            <div className="login">
                <div className="login_wrapper">

                    <div className="left_div">
                        <div className="heading">
                            <h2>Login</h2>
                        </div>

                        <div className="input_field">
                            <input type="email" name="email" onChange={handelChange} value={user.email} placeholder='Enter your email' />
                        </div>


                        <div className="input_field">
                           <i className={`${passwordStyle} password_eye`} onClick={handlePasswordSeen}></i>
                            <input type={passwordType} name="password" onChange={handelChange} value={user.password} placeholder='Enter password' />
                        </div>


                        <div className="btn__cont">
                           <p onClick={ loginUser }>Login</p>
                        </div>

                        <div className="dont_have_account">
                            <Link to="/register">Don't have an account ?</Link>
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

export default Login;