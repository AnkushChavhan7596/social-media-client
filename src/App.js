import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Layouts/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Followers from "./Pages/Followers/Followers";
import Following from "./Pages/Following/Following";
import EditProfile from "./Pages/EditProfile/EditProfile";
import CreatePost from "./Pages/CreatePost/CreatePost";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import Login from "./Pages/Login/Login";
import UpdatePost from "./Pages/UpdatePost/UpdatePost";
import Register from "./Pages/Register/Register";
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Comments from './Pages/Comments/Comments';
import ProfileUser from "./Pages/ProfileUsers/ProfileUser";
import env from "react-dotenv";
import Cookies from 'js-cookie';
import React, {useState, useEffect} from "react";
import axios from 'axios';

// require("dotenv").config();
// require('dotenv-webpack');


function App() {

    const [currentActiveUser, setCurrentActiveUser] = useState({});

    ///////////////////////////////////////////
    //////////// load active user

    const loadActiveUser = async () => {
        try {
            const res = await axios.post(`https://social-media-ankush.herokuapp.com/get_active_user_by_token`, { token: Cookies.get("jwt") });

            if (res.status === 200) {
                setCurrentActiveUser(res.data.activeUser);
            }
            else {
                console.log(res.data.msg)
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(()=>{
        if(Cookies.get("jwt")){
            loadActiveUser();
        }
   },[])

    return (
        <div className="App">
            <Router>
                <Navbar />

                <Routes>

                    <Route path="/" element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                    </Route>

                    <Route path="/home" element={<PrivateRoute />}>
                        <Route path="/home" element={<Home />} />
                    </Route>

                    <Route path="/profile" element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route path="/profile/:id" element={<PrivateRoute />}>
                        <Route path="/profile/:id" element={<ProfileUser />} />
                    </Route>

                    <Route path="/create-post" element={<PrivateRoute />}>
                        <Route path="/create-post" element={<CreatePost />} />
                    </Route>

                    <Route path="/followers" element={<PrivateRoute />}>
                        <Route path="/followers" element={<Followers currentActiveUser={currentActiveUser} />} />
                    </Route>

                    <Route path="/comments/:id" element={<PrivateRoute />}>
                        <Route path="/comments/:id" element={<Comments />} />
                    </Route>


                    <Route path="/update-post/:id" element={<PrivateRoute />}>
                        <Route path="/update-post/:id" element={<UpdatePost />} />
                    </Route>

                    <Route path="/edit-profile" element={<PrivateRoute />}>
                        <Route path="/edit-profile" element={<EditProfile />} />
                    </Route>


                    <Route path="/following" element={<Following />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />

                    <Route path="*" element={<PageNotFound />} />

                </Routes>

            </Router>

        </div>
    );
}

export default App;
