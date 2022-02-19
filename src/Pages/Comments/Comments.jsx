import React, { useState, useEffect } from "react";
import "./Comments.css";
import { Link, useParams } from "react-router-dom";
import Post from "../../Components/Post/Post";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import Comment from "../../Components/comment/Comment";
import Loader from "../Loader/Loader";


const Comments = () => {
    const { id } = useParams();


    const [commentPost, setCommentPost] = useState({});
    const [currentActiveUser, setCurrentActiveUser] = useState({});
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [postUser, setPostUser] = useState({});
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // loadCommentPost();
        axios.post(`http://localhost:8000/get_post_by_id`, { id: id }).then((res) => {

            if (res.status === 200) {
                setCommentPost(res.data.post);
                setPostUser(res.data.user);
                setLikeCount(res.data.post.likes.length);
            }
            else {
                console.log("Post not found");
            }
        })


    }, []);

        ///////////////////////////////////
        ///////////// handle post like
        const handleLike = async (authorID, postID) =>{
            try{
                const id = authorID;
                const res = await axios.post(`http://localhost:8000/post-like/${id}`, {postID : postID});

                if(res.status === 200){
                  console.log(res.data.msg);
                  setLikeCount(res.data.liked ? likeCount + 1 : likeCount - 1);

                }else{
                    console.log(res.data.msg);
                }

            }
            catch(error){
                console.log(error);
            }

        }



    ////////////////////////////////////////////////////////////////////
    ////////////////// load all comments
    const loadComments = async () => {
        try {

            const res = await axios.get("http://localhost:8000/comments/get");

            if (res.status === 200) {
                setComments(res.data.reverse());
            }
            else {
                console.log(res.data.msg);
            }

        } catch (error) {
            console.log(error.message);
        }
    }


    //////////////////////////////////////
    /////////////// handle comment post
    const handleCommentPost = async () => {
        try {
            const res = await axios.post("http://localhost:8000/comment/post", { comment: comment, postID: id, token: Cookies.get("jwt") });

            if (res.status === 200) {
                console.log("Comment Posted");
                setComment("");
                console.log("from handle comment")
                loadComments();
            }
            else {
                console.log(res.data.msg);
            }
        } catch (error) {
            console.log(error);
        }
    }





    useEffect(() => {
        loadComments();
    }, [])



    //////////////////////////////////////////////////////////////////
    /////////////////////// load current active user
    const loadCurrentActiveUser = async () => {
        const res = await axios.post("http://localhost:8000/get_active_user_by_token", { token: Cookies.get("jwt") });

        if (res.status === 200) {
            setCurrentActiveUser(res.data.activeUser);
        }
        else {
            console.log(res.data.msg);
        }
    }


    useEffect(() => {
        loadCurrentActiveUser();
    }, [])


    return (
        <>
            <div className="comments">

                <div className="comments_left_block">
                    <h2 className="comments_heading"> Comments</h2>

                    <div className="comments_div">

                        {
                            comments.filter( comment => comment.postID === id).length === 0 ? 
                            
                            <h2 className="no_comment_txt">No Comments yet , Being the first one 😎</h2>
                           
                           :
                           
                           comments.filter((comment) => comment.postID === id).map((comment) => {
                                return (
                                    <Comment comment={comment} postID={id} key={comment._id} />
                                )
                            })
                        }


                        {/* <div className="comment">
                            <div className="comment_profile">
                                <img src={commentProfileImg} alt="comment_profile" />
                            </div>

                            <div className="comment_txt_div">
                                <div className="name">
                                    <p className="comment_owner_name">Rahul Dravid</p>
                                </div>
                                <div className="actual_comment">
                                    <p>Awesome , how are all guys ?</p>
                                </div>
                            </div>

                                {/* comments delete modal */}
                        {/* <div className={`comments_delete_modal ${commentDeleteModalStyle}`}>
                                <p className="dummyTxt">Are you sure ?</p>

                                <div className="comment_delete_btns_div">
                                    <Link to="/comments" className="delete_comment_link" onClick={handleCommentDeleteModal}>Delete</Link>

                                    <Link to="/comments" className="delete_comment_link" onClick={handleCommentDeleteModal}>Cancel</Link>
                                </div>
                            </div>

                        <i className="fas fa-ellipsis-v comment_dots" onClick={handleCommentDeleteModal} data-commentID = {"1"}></i>
                     </div>



                     <div className="comment">
                            <div className="comment_profile">
                                <img src={commentProfileImg} alt="comment_profile" />
                            </div>

                            <div className="comment_txt_div">
                                <div className="name">
                                    <p className="comment_owner_name">Rahul Dravid</p>
                                </div>
                                <div className="actual_comment">
                                    <p>Awesome , how are all guys ?asdfs asdf asdf asdf sad fasdf sadf sad f sadf  dsa f sadf sad f as</p>
                                </div>
                            </div>

                                {/* comments delete modal */}
                        {/* <div className={`comments_delete_modal ${commentDeleteModalStyle}`}>
                                <p className="dummyTxt">Are you sure ?</p>

                                <div className="comment_delete_btns_div">
                                    <Link to="/comments" className="delete_comment_link" onClick={handleCommentDeleteModal}>Delete</Link>

                                    <Link to="/comments" className="delete_comment_link" onClick={handleCommentDeleteModal}>Cancel</Link>
                                </div>
                           
                            </div>

                        <i class="fas fa-ellipsis-v comment_dots" onClick={handleCommentDeleteModal}></i>
                    //  </div> */}
                        {/* /}* */}



                    </div>


                    <div className="comment_send_box">
                        <input type="text" className="comment_input" value={comment} onChange={(e) => { setComment(e.target.value) }} name="comment" placeholder="Add public comment" autoComplete="off" />
                        <div className="comment_post_btn" onClick={handleCommentPost}>
                            <i className="fas fa-paper-plane"></i>
                            post
                        </div>
                    </div>

                </div>

                <div className="comments_right_block">
                    <div className="comment_post_wrapper">

                        <div className="Post comment_post">
                            <Link to={`/profile/${commentPost.authorID}`}>
                                <div className="post_header">


                                    <div className="post_profile_img_wrapper">
                                        <img src={commentPost.profileImg ? `${process.env.REACT_APP_IMAGE_PATH}${commentPost.profileImg}` : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`} alt="profile" />
                                    </div>

                                    <div className="post_profile_name_wrapper">
                                        <p>{commentPost.authorName}</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="post_body">
                                <img src={commentPost.postImage ? `${process.env.REACT_APP_IMAGE_PATH}${commentPost.postImage}` : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`} alt="profile" />
                            </div>

                            <div className="post_footer">
                                <div className="post_footer_left">
                                    <div className="icons">
                                        <Link to={`/comments/${commentPost._id}`}>
                                            <i className="far fa-heart" onClick={() => { handleLike(currentActiveUser._id, commentPost._id) }}></i>
                                        </Link>

                                        <Link to={`/comments/${commentPost._id}`}>
                                            <i className="far fa-comment"></i>
                                        </Link>

                                        <Link to="/">
                                            <i className="fas fa-share"></i>
                                        </Link>
                                    </div>

                                    <div>
                                        <p className="like_count">{likeCount}</p>
                                    </div>
                                </div>

                                <div className="post_footer_right">
                                    <Link to={`/comments/${commentPost._id}`}><p><span className="comment_count">{comments.filter(comment => comment.postID === commentPost._id).length}</span>comments</p></Link>
                                </div>



                            </div>
                        </div>

                    </div>

                </div>

            </div >
        </>
    )
}

export default Comments;