import React, { useState , useEffect} from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import ProfileImg from "../../Assets/Images/amirhossein-soltani-JCyGsKePWNs-unsplash.jpg";
import PostImg from "../../Assets/Images/collins-lesulie-0VEDrQXxrQo-unsplash.jpg";
import axios from "axios";
import Cookies from "js-cookie";
import { format } from "timeago.js";

const Post = ({ postData, currentActiveUser }) =>{
    
        const [likeCount, setLikeCount] = useState(0);
        const [postUser, setPostUser] = useState({});
        const [comments, setComments] = useState([]);
        const [likeStyle, setLikeStyle] = useState("far fa-heart")
        const [alredyLiked, setAlreadyLiked] = useState("fa-solid fa-heart red");
        const [nonLiked, setNonLiked] = useState("far fa-heart");

  
        // load active user
        const loadActivePostUser = async () =>{

            const res = await axios.post(`http://localhost:8000/get_user_by_id/${postData.authorID}`);
                    
                if(res.status === 200){
                    setPostUser(res.data.user);
                    setLikeCount(postData.likes.length);
                }
                else{
                   console.log(res.data.msg);
                }
        }


             ////////////////////////////////////////////////////////////////////
        ////////////////// load all comments
        const loadComments = async () =>{
            try{
                
                const res = await axios.get("http://localhost:8000/comments/get");

                if(res.status === 200){
                    setComments(res.data);
                }
                else{
                    console.log(res.data.msg);
                }

            }catch(error){
                console.log(error.message);
            }
        }

        useEffect(()=>{
             loadComments();
        },[])


        useEffect(()=>{
            loadActivePostUser();
        },[]);



        ///////////////////////////////////
        ///////////// handle post like
        const handleLike = async (authorID, postID) =>{
            try{
                const id = authorID;
                const res = await axios.post(`http://localhost:8000/post-like/${id}`, {postID : postID});

                if(res.status === 200){
                  console.log(res.data.msg);
                  setLikeCount(res.data.liked ? likeCount + 1 : likeCount - 1);

                //   if(res.data.liked){
                //       nonLiked("far fa-heart");
                //       alredyLiked("fa-solid fa-heart red");

                //   }
                //   else{
                //       alredyLiked("fa-solid fa-heart red");
                //       nonLiked("far fa-heart");
                //   }

                //   if(res.data.liked){
                //       setLikeStyle("fa-solid fa-heart red")
                //   }
                //   else{
                //     setLikeStyle("far fa-heart")
                //   }

                }else{
                    console.log(res.data.msg);
                }
            }
            catch(error){
                console.log(error);
            }

        }

        const reload = () =>{
            window.reload();
        }
    


    return(
        <>
           <div className="Post">
          {/* { postData.authorID === currentActiveUser._id ? "/profile":  ""} */}
               <Link to={postData.authorID === currentActiveUser.id ? "/profile" : `/profile/${postData.authorID}`} onClick={reload}>
                    <div className="post_header">
                                <div className="post_profile_img_wrapper">
                                    <img src={postUser.profileImg ? `${process.env.REACT_APP_IMAGE_PATH}${postUser.profileImg}` : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`} alt="profile" />
                                </div>
                                
                                <div className="post_profile_name_wrapper">
                                    <p>{postData.authorName}</p>
                                </div>
                    </div>
               </Link>

               <div className="post_body">
                   <img src={`${process.env.REACT_APP_IMAGE_PATH}${postData.postImage}`} alt="profile" />
                </div>

                <div className="post_footer">
                       <div className="post_footer_left">
                           <div className="icons">
                                <Link to="/" onClick={() => {handleLike(currentActiveUser._id, postData._id)}}>
                                    {
                                        postData.likes.includes(currentActiveUser._id) ?
                                        <i className={`${alredyLiked}`} onClick={alredyLiked === "fa-solid fa-heart red" ? () =>setAlreadyLiked("far fa-heart") :
                                                                                                                           () =>setAlreadyLiked("fa-solid fa-heart red")} ></i>
                                        :
                                        <i className={`${nonLiked}`} onClick={nonLiked === "far fa-heart" ? () =>setNonLiked("fa-solid fa-heart red") :
                                        () =>setNonLiked("far fa-heart")}></i>
                                    }
                                </Link>

                                <Link to={`/comments/${postData._id}`}>
                                    <i className="far fa-comment"></i>
                                </Link>

                                <Link to="/">
                                <i className="fas fa-share"></i>
                                </Link>
                            </div>

                            <div>
                                <p className="like_count">{likeCount}</p>
                                <p className="time_ago">{format(postData.timestamp)}</p>
                            </div>
                        </div>  

                        <div className="post_footer_right">
                             <Link to={`/comments/${postData._id}`}><p><span className="comment_count">{comments.filter( comment => comment.postID === postData._id).length}</span>comments</p></Link>  
                        </div>         
                 </div>
                     
           </div>
        </>
    )
}

export default Post;