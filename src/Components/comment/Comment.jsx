import React, { useState, useEffect } from "react";
import "./Comment.css";
import commentProfileImg from "../../Assets/Images/collins-lesulie-0VEDrQXxrQo-unsplash.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Comment = ({ comment, postID, commentsCount }) => {
  const navigate = useNavigate();
  const [commentDeleteModalStyle, setCommentDeleteModalStyle] = useState(
    "hide_comment_delete_modal"
  );
  const [overlayStyle, setOverlayStyle] = useState("hide_overlay");
  const [commentUser, setCommentUser] = useState({});
  const [activeUser, setActiveUser] = useState({});

  ////////////////////////////////////
  //////////// load current comment user

  const loadCommentUser = async () => {
    try {
      const res = await axios.post(
        `https://social-media-ankush.herokuapp.com/get_user_by_id/${comment.authorID}`
      );

      if (res.status === 200) {
        setCommentUser(res.data.user);
      } else {
        console.log(res.data.msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadCommentUser();
  }, [comment]);

  // overlay
  const handleOverlay = () => {
    if (commentDeleteModalStyle === "hide_comment_delete_modal") {
      setCommentDeleteModalStyle("show_comment_delete_modal");
      setOverlayStyle("show_overlay");
    } else {
      setCommentDeleteModalStyle("hide_comment_delete_modal");
      setOverlayStyle("show_overlay");
      setOverlayStyle("hide_overlay");
    }
  };

  //////////////////////////////////////////////////////////
  ////////////////// get current user by token

  const loadActiveUser = async () => {
    try {
      const res = await axios.post(
        "https://social-media-ankush.herokuapp.com/get_active_user_by_token",
        { token: Cookies.get("jwt") }
      );

      if (res.status === 200) {
        setActiveUser(res.data.activeUser);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadActiveUser();
  }, [Cookies.get("jwt")]);

  // handle comment delete modal
  const handleCommentDeleteModal = () => {
    if (commentDeleteModalStyle === "hide_comment_delete_modal") {
      setCommentDeleteModalStyle("show_comment_delete_modal");
      setOverlayStyle("show_overlay");
    } else {
      setCommentDeleteModalStyle("hide_comment_delete_modal");
      setOverlayStyle("hide_overlay");
    }
  };

  ////////////////////////////////////////////////////
  /////////////// handle delete the comment
  const handleDeleteComment = async (id) => {
    try {
      const res = await axios.post(
        `https://social-media-ankush.herokuapp.com/comment/delete/${id}`
      );

      if (res.status === 200) {
        console.log("Comment Deleted");
        navigate("/", { replace: true });
        navigate(`/comments/${postID}`, { replace: true });
      } else {
        console.log(res.data.msg);
      }
    } catch (error) {
      console.log(error.message);
    }

    if (commentDeleteModalStyle === "hide_comment_delete_modal") {
      setCommentDeleteModalStyle("show_comment_delete_modal");
      setOverlayStyle("show_overlay");
    } else {
      setCommentDeleteModalStyle("hide_comment_delete_modal");
      setOverlayStyle("hide_overlay");
    }
  };

  return (
    <>
      <div className="comment">
        <div
          className={`overlay ${overlayStyle}`}
          onClick={handleOverlay}
        ></div>

        <div className="comment_profile">
          <Link to={`/profile/${commentUser._id}`}>
            <img
              src={
                commentUser.profileImg
                  ? `https://social-media-ankush.herokuapp.com/public/Images/${commentUser.profileImg}`
                  : `https://social-media-ankush.herokuapp.com/public/Images/user (1).png`
              }
              alt="profile"
            />
          </Link>
        </div>

        <div className="comment_txt_div">
          <div className="name">
            <p className="comment_owner_name">{commentUser.name}</p>
          </div>
          <div className="actual_comment">
            <p>{comment.comment}</p>
          </div>
        </div>

        {activeUser._id === comment.authorID ? (
          <div className={`comments_delete_modal ${commentDeleteModalStyle}`}>
            <p className="dummyTxt">Are you sure ?</p>

            <div className="comment_delete_btns_div">
              <Link
                to={`/comments/${postID}`}
                className="delete_comment_link"
                onClick={() => {
                  handleDeleteComment(comment._id);
                }}
              >
                Delete
              </Link>

              <Link
                to={`/comments/${postID}`}
                className="delete_comment_link"
                onClick={handleCommentDeleteModal}
              >
                Cancel
              </Link>
            </div>
          </div>
        ) : (
          <div className={`comments_delete_modal ${commentDeleteModalStyle}`}>
            <p className="dummyTxt">You can't delete</p>

            <div className="comment_delete_btns_div">
              <Link
                to={`/comments/${postID}`}
                className="delete_comment_link"
                onClick={handleCommentDeleteModal}
              >
                Cancel
              </Link>
            </div>
          </div>
        )}

        <i
          className="fas fa-ellipsis-v comment_dots"
          onClick={handleCommentDeleteModal}
        ></i>
      </div>
    </>
  );
};

export default Comment;
