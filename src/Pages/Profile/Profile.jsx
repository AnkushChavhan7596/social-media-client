import React, {useState, useEffect } from 'react';
import "./Profile.css";
import { Link , useNavigate } from "react-router-dom";
import Profile_img from "../../Assets/Images/profile.png";
import Cookies  from 'js-cookie';
import axios from 'axios';
import Swal from "sweetalert2";
import Loader from '../Loader/Loader';
import {format} from "timeago.js";

 
const Profile = () =>{

   const navigate = useNavigate();
   const [posts, setPosts] = useState([]);
   const [activeUser, setActiveUser] = useState({});
   const [followerswCount, setFollowersCount] = useState(0);
   const [followingsCount, setFollowingsCount] = useState(0);
    
    const [overlayStyle, setOverlayStyle] = useState("hide_overlay")
    const [settingModal, setSettingModal] = useState("hideModal");

    // profile image
    const [profileImg, setProfileImg] = useState([]);


    // handle setting modal
    const handleSettingModal = ()=>{
        if(settingModal === "hideModal"){
            setSettingModal("showModal");
            setOverlayStyle("show_overlay");
        }
        else{
            setSettingModal("hideModal");
            setOverlayStyle("hide_overlay");
        }

    }

  

    const handleOverlay = () =>{
        if(settingModal === "showModal"){
            setSettingModal("hideModal");
            setOverlayStyle("hide_overlay");
        }
        else{
            setSettingModal("showModal");
            setOverlayStyle("show_overlay");
        }
    }


    // handle logout
    const handleLogOut = () =>{

        Cookies.remove("jwt");

        
        Swal.fire(
            "Greate",
            "Logged out Successfully",
            "success"
            )
            
        navigate("/login", {replace: true});
    }


    // load active user
    const loadActiveUser = async () =>{
        const res = await axios.post("http://localhost:8000/get_active_user_by_token", {token : Cookies.get("jwt")})
                
            if(res.status === 200){
                setActiveUser(res.data.activeUser);
                setFollowersCount(res.data.activeUser.followers.length);
                setFollowingsCount(res.data.activeUser.followings.length);
            }
            else{
                Swal.fire(
                    "Oops",
                    res.data.msg,
                    "info"
                )

                navigate("/login", {replace : true});
            }
    }


    //load posts
    const loadPosts = async () =>{
        const res = await axios.get("http://localhost:8000/all-posts")
            
            if(res.status === 200){
                // setPosts(res.data.reverse())
                setPosts(res.data.reverse());

            //   setPosts(res.data.filter( post => post.authorID === activeUser._id))

            // const newPostsList = posts.filter( post => post.authorID === activeUser._id);

            // setPosts(newPostsList);

            setPosts(res.data);
            
            }
            else{
                Swal.fire(
                    "Oops",
                    res.data.msg,
                    "info"
                )
            }
    }


    useEffect(()=>{
        loadPosts();
    }, []);

    useEffect(()=>{
        loadActiveUser();
    },[Cookies.get("jwt")])


    // profile file change
    const onChangeFile = (e) =>{
        setProfileImg(e.target.files[0]);
    }

    // handle profile submit
    const handleProfileSubmit = async (e) =>{
        e.preventDefault();

        let formData = new FormData();

        formData.append("profileImg", profileImg);
        formData.append("token", Cookies.get("jwt"));

       const res = await axios.post("http://localhost:8000/post/update/profile-pic", formData)

       if(res.status === 200){
           console.log("Profile pic updated");

           Swal.fire(
               "Greate",
               res.data.msg,
               "success"
             )
             loadActiveUser();
       }
       else{
           Swal.fire(
               "Oops",
               res.data.msg,
               "info"
           )
       }
    }


    //////////////////////////////////////////////
    ////////// handle delte post
    const handleDeletePost = async (id) =>{
        try{
           const res = await axios.post(`http://localhost:8000/post/delete/${id}`);

           if(res.status === 200){
              console.log("Post delted");

              
              Swal.fire(
                  "Greate",
                 res.data.msg,
                  "success"
              )
             loadPosts();

           }
           
        }catch(error){
            Swal.fire(
                "Greate",
              error,
                "success"
            )
            console.log(error);
        }
    }



    return(
        <>
          {
             posts.length === 0 ? <Loader /> 

             :
           <div className="profile">

               <div className={`overlay ${overlayStyle}`} onClick={handleOverlay}></div>

                <div className="profile_wrapper">

                    <div className="profile_header">
                            <div className="profile_left">
                                  <div className="user_name">
                                      <h2>{activeUser.username}</h2>
                                  </div>
                                  <div className="name">
                                      <p>{activeUser.name}</p>
                                  </div>

                                  

                                      <div className="following_followers_div" >
                                            <div className="posts_count">
                                                <p>Posts : <span>{posts.filter( post => post.authorID === activeUser._id ).length}</span></p>
                                                <p className='joined_at'>Joined At : {format(activeUser.timestamp)}</p>
                                            </div>

                                            <div className='profile_followers_wrapper'>
                                                <Link to="/followers" className='foll_link'>
                                                        <div className="profile_followers">
                                                            <p className='foll_title' >Followers</p>
                                                            <p className='foll'>{followerswCount}</p>
                                                        </div>
                                                </Link>

                                                <Link to="/followers" className='foll_link'>
                                                        <div className="profile_following">
                                                            <p className='foll_title'>Following</p>
                                                            <p className='foll'>{followingsCount}</p>
                                                        </div>
                                                </Link>
                                            </div>

                                      </div>
                                     
                             

                                  <div className="edit_profile_btn_wrapper">
                                     <Link to="/edit-profile">Edit Profile</Link>
                                  </div>
                            </div>
        
                            <div className="profile_right">
                                 <i className="fas fa-cog setting_btn" onClick={handleSettingModal}></i>
                               
                                  <img src={activeUser.profileImg ? `${process.env.REACT_APP_IMAGE_PATH}${activeUser.profileImg}` : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`} alt="profileImg" />
                                  
                                  <div className="change_img_wrapper">
                                      <form onSubmit={handleProfileSubmit} encType="multipart/form-data">
                                         <input type="file" name="profileImg" onChange={onChangeFile} className='profile_pic_change_input'  required/>
                                         <button type="submit">Change Pic</button>
                                      </form>
                                  </div>

                                  <div className={`setting_modal ${settingModal}`}>
                                       <Link to="/" className='setting_modal_links'>Contact Us</Link>
                                       <Link to="/" className='setting_modal_links'>Change password</Link>
                                       <Link to="/" className='setting_modal_links'>help</Link>
                                       <button className='setting_modal_links' onClick={handleLogOut}>Logout</button>
                                  </div>
                            </div>       
                    </div>


                   {/* //////////////////////////////// profile body //////////////////////////////// */}

                    <div className="profile_body">
                        <div className="profile_body_heading">
                            <h2>Your Posts</h2>

                            <div className="profile_posts_wrapper">

                              {
                                  posts.filter( post => post.authorID === activeUser._id ).length == 0 ?
                                  <h3 className='no_posts'>No Posts Yet 😞</h3>
                                  :
                                  posts.filter( post => post.authorID === activeUser._id ).map((post)=> {
                                      return(
                                        <div className="profile_post" key={post._id}>
                                            <img src={`${process.env.REACT_APP_IMAGE_PATH}${post.postImage}`} alt="img" />
                                            <div className="bottom_strip">
                                                 <i className="fas fa-trash-alt" onClick={() => {handleDeletePost(post._id)}}></i>

                                                <Link to={`/update-post/${post._id}`} >
                                                   <i className="fas fa-edit"></i>
                                                </Link>
                                               
                                              
                                            </div>
                                       </div>
                                      )
                                  })
                              }
                             
                               
                              
                            </div>
                        </div>
                    </div>

                          
                </div>    
            </div>

          }

        </>
    )
}

export default Profile;
