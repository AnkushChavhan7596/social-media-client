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
 

const Home = ({currentActiveUser}) =>{

    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

    //load posts
    useEffect(()=>{
        axios.get("http://localhost:8000/all-posts").then((res)=>{
            
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
            const res = await axios.get("http://localhost:8000/users");

            if(res.status === 200){
                setUsers(res.data.filter(user => !currentActiveUser.followings.includes(user._id)));
            }

        }catch(error){
            console.log(error.message);
        }
    }




    useEffect(() =>{
        loadUsers();
    },[currentActiveUser])





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
                           
                            users.filter(user => currentActiveUser._id !== user._id)
                            .slice(0,9).map((user)=>{
                                return(
                                    <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id}/>
                                )
                            })
                    
                        }
        
                    </div>

                    <div className="view_more_btn_wrapper">
                       <Link to="/explore" className="view_more">View More</Link>
                    </div>

               </div>
            </div>
            
            }
        </>
    )
}

export default Home;
