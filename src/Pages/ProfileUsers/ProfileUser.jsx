import React, { useState, useEffect } from "react";
import "./ProfileUser.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Profile_img from "../../Assets/Images/profile.png";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import Profile from "../Profile/Profile";
import { format } from "timeago.js";

const ProfileUser = ({ currentActiveUser }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [clickedUser, setClickedUser] = useState({});
  const [followerswCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);

  // load user that is clicked user
  // load user by id
  const loadClickedUser = async () => {
    const res = await axios.post(`http://localhost:8000/get_user_by_id/${id}`);

    if (res.status === 200) {
      setClickedUser(res.data.user);
      setFollowersCount(res.data.user.followers.length);
      setFollowingsCount(res.data.user.followings.length);
    } else {
      Swal.fire("Oops", res.data.msg, "info");

      navigate("/login", { replace: true });
    }
  };

  //load posts
  const loadPosts = async () => {
    const res = await axios.get("http://localhost:8000/all-posts");

    if (res.status === 200) {
      // setPosts(res.data.reverse())
      setPosts(res.data.reverse());
      console.log(res.data);

      setPosts(res.data);
    } else {
      Swal.fire("Oops", res.data.msg, "info");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    loadClickedUser();
  }, [id]);

  const [followTxt, setFollowTxt] = useState("Follow");
  const [unFollowTxt, setUnfollowTxt] = useState("Unfollow");

  ////////////////////////////////////////
  ///////////// handle follow unfollow
  const handleFollowUnfollow = async (userID) => {
    try {
      const res = await axios.post(`http://localhost:8000/follow-unfollow`, {
        id: userID,
        token: Cookies.get("jwt"),
      });

      if (res.status === 200) {
        console.log(res.data.msg);

        // if (res.data.follow) {
        //   if (followTxt === "Follow") {
        //     setFollowTxt("Unfollow");
        //   } else {
        //     setFollowTxt("Follow");
        //   }
        // } else {
        //   if (res.data.unfollow) {
        //     if (unFollowTxt === "Unfollow") {
        //       setUnfollowTxt("Follow");
        //     } else {
        //       setUnfollowTxt("Unfollow");
        //     }
        //   }
        // }

        if(unFollowTxt === "Unfollow"){
            if(!res.data.follow){
                setUnfollowTxt("Follow");
            }
            else{
                setUnfollowTxt("Unfollow")
            }
        }
        else{
            if(res.data.follow){
                setUnfollowTxt("Unfollow")
            }
        }


        if(followTxt === "Follow"){
            if(res.data.follow){
                setFollowTxt("Unfollow")
            }
            else{
                setFollowTxt("Follow")
            }
        }
        else{
            if(!res.data.follow){
                setFollowTxt("Follow")
            }
        }

        
        // if(res.data.follow){
        //     if(unFollowTxt === "Unfollow"){
        //         setUnfollowTxt("Follow");
        //         setFollowTxt("Unfollow")
        //     }
        // }
        // else{
        //     setUnfollowTxt("Unfollow");
        //     setFollowTxt("Follow")
        // }


      } else {
        if (res.data.followedYourSelf) {
          console.log("You can't follow yourself");
          Swal.fire("Oops", res.data.msg, "info");
        }
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {currentActiveUser._id === id ? (
        <Profile />
      ) : posts.length === 0 ? (
        <Loader />
      ) : (
        <div className="profile">
          <div className="profile_wrapper">
            <div className="profile_header">
              <div className="profile_left">
                <div className="user_name">
                  <h2>{clickedUser.username}</h2>
                </div>
                <div className="name">
                  <p>{clickedUser.name}</p>
                </div>

                <div className="following_followers_div">
                  <div className="posts_count">
                    <p>
                      Posts :{" "}
                      <span>
                        {
                          posts.filter(
                            (post) => post.authorID === clickedUser._id
                          ).length
                        }
                      </span>
                    </p>
                    <p className="joined_at">
                      Joined At : {format(currentActiveUser.timestamp)}
                    </p>
                  </div>

                  <div className="profile_followers_wrapper">
                    <Link to="/followers" className="foll_link">
                      <div className="profile_followers">
                        <p className="foll_title">Followers</p>
                        <p className="foll">{followerswCount}</p>
                      </div>
                    </Link>

                    <Link to="/followers" className="foll_link">
                      <div className="profile_following">
                        <p className="foll_title">Following</p>
                        <p className="foll">{followingsCount}</p>
                      </div>
                    </Link>
                  </div>

                  <div className="profile_user_foll_unfoll">
                    <button
                      className="profile_user_foll_unfoll_button"
                      onClick={() => {
                        handleFollowUnfollow(id);
                      }}
                    >
                      {clickedUser.followers.includes(currentActiveUser._id)
                        ? unFollowTxt
                        : followTxt }
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile_right">
                <img
                  src={
                    clickedUser.profileImg
                      ? `${process.env.REACT_APP_IMAGE_PATH}${clickedUser.profileImg}`
                      : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`
                  }
                  alt="profileImg"
                />
              </div>
            </div>

            {/* //////////////////////////////// profile body //////////////////////////////// */}

            <div className="profile_body">
              <div className="profile_body_heading">
                <h2> Posts</h2>

                <div className="profile_posts_wrapper">
                  {posts
                    .filter((post) => post.authorID === id)
                    .map((post) => {
                      return (
                        <div className="profile_post" key={post._id}>
                          <img
                            src={`${process.env.REACT_APP_IMAGE_PATH}${post.postImage}`}
                            alt="img"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileUser;
