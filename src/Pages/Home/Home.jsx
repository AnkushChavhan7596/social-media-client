import React, { useState, useEffect } from 'react';
import "./Home.css";
import { Link } from "react-router-dom";
import Post from "../../Components/Post/Post";
import axios from "axios";
import FriendsPost from '../../Components/FriendsPost/FriendsPost';
import SuggestionItem from "../../Components/SuggestionItem/SuggestionItem";
import Swal from "sweetalert2";
import Loader from '../Loader/Loader';
import Cookies from 'js-cookie';
 

const Home = () =>{

    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentActiveUser, setCurrentActiveUser] = useState({});

    //load posts
    useEffect(()=>{
        axios.get(`https://social-media-ankush.herokuapp.com/all-posts`).then((res)=>{
            
            if(res.status === 200){

                setPosts(res.data.reverse())

            }
            else{
                Swal.fire(
                    "Oops",
                    res.data.msg,
                    "info"
                )
            }
        })


    }, []);

    

    /////////////////////////////////////////
    ////////////// load users

    const loadUsers = async () =>{
        try{
            const res = await axios.get(`https://social-media-ankush.herokuapp.com/users`);

            if(res.status === 200){
                setUsers(res.data);
            }

        }catch(error){
            console.log(error.message);
        }
    }

             //////////////////////////////////////////////////////////////////
       /////////////////////// load current active user
       const loadCurrentActiveUser = async () =>{
        const res = await axios.post(`https://social-media-ankush.herokuapp.com/get_active_user_by_token`, {token : Cookies.get("jwt")});
        if(res.status === 200){
            setCurrentActiveUser(res.data.activeUser);
        }
        else{
            console.log(res.data.msg);
        }
    } 

        useEffect(()=>{
            loadCurrentActiveUser();
        },[])





    useEffect(() =>{
        loadUsers();
    },[])





    return(
        <>
            {
                posts.length === 0 ? <Loader /> 

                :
            
            <div className="home">
               <div className="home_left">
                     <div>
                          <FriendsPost posts={posts}/>
                     </div>

                     <div className="posts_container">
                         {
                             posts.map((post)=>{
                                 return (
                                     <Post postData={post} currentActiveUser={currentActiveUser} key={post._id}/>
                                 )
                             })
                         }
                     </div>
               </div>


               <div className="home_right">

                    <p className='suggestion_txt'>Suggestions For You</p>

                    <div className="friend_suggestion">
                        {
                            users.filter(user => user._id !== currentActiveUser._id).slice(0,9).map((user)=>{
                                return(
                                    <SuggestionItem user={user} key={user._id}/>
                                )
                            })
                        }
        
                    </div>

                    <div className="view_more_btn_wrapper">
                       <Link to="/" className="view_more">View More</Link>
                    </div>

               </div>
            </div>
            
            }
        </>
    )
}

export default Home;
