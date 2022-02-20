import React, { useState } from "react";
import "./Followers.css";
import ProfileImg from "../../Assets/Images/nathan-dumlao-yAS082fvix8-unsplash.jpg";
import Loader from "../Loader/Loader";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import SuggestionItem from "../../Components/SuggestionItem/SuggestionItem";

const Followers = ({ currentActiveUser }) => {
  const [followersBlock, setFollowersBlock] = useState("block");
  const [followingsBlock, setFollowingsBlock] = useState("hide");
  const [user, setUser] = useState({});
  const [followerUsers, setFollowerUsers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [activeFollowersStyle, setActiveFollowersStyle] =
    useState("active_btn");
  const [activeFollowingsStyle, setActiveFollowingsStyle] =
    useState("non_active_btn");

  ///////////////////////////////////
  ////// handle followers block
  const handleFollowersBlock = () => {
    setFollowersBlock("block");
    setFollowingsBlock("hide");
    setActiveFollowersStyle("active_btn");
    setActiveFollowingsStyle("non_active_btn");
  };

  ////////////////////////////
  ////////// handle followings block
  const handleFollowingsBlock = () => {
    setFollowingsBlock("block");
    setFollowersBlock("hide");
    setActiveFollowersStyle("non_active_btn");
    setActiveFollowingsStyle("active_btn");
  };

  /////////////////////////////////////////////////////
  //////////////////// get user by id
  const getUserById = async (id) => {
    try {
      const res = await axios.get(
        `https://social-media-ankush.herokuapp.com/get_user_by_id/${id}`
      );

      if (res.status === 200) {
        setUser(res.data);
      } else {
        console.log(res.data.msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /////////////////////////////////////////
  ////////////// load users

  const loadUsers = async () => {
    try {
      const res = await axios.get(
        "https://social-media-ankush.herokuapp.com/users"
      );
      console.log(res);

      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentActiveUser]);

  ///////////////////////////////////////////////////////////
  /////////////// get all followers user
  const getAllFollowersUsers = async () => {
    currentActiveUser.followers.map(async (followerID) => {
      try {
        const res = await axios.post(
          `https://social-media-ankush.herokuapp.com/get_user_by_id/${followerID}`
        );
        if (res.status === 200) {
          setFollowerUsers((list) => [...list, res.data.user]);
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  /////////////////////////////////////////////////////////
  /////////////// get all followings user
  const getAllFollowingsUser = async () => {
    currentActiveUser.followings.map(async (followingID) => {
      try {
        const res = await axios.post(
          `https://social-media-ankush.herokuapp.com/get_user_by_id/${followingID}`
        );

        if (res.status === 200) {
          setFollowingUsers((list) => [...list, res.data.user]);
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  };

  useEffect(() => {
    getAllFollowersUsers();
  }, [currentActiveUser]);

  useEffect(() => {
    getAllFollowingsUser();
  }, [currentActiveUser]);

  return (
    <>
      <div className="followers__main">
        <div className="followers___wrapper">
          <div className="foll_wrapper_header">
            <div className="left">
              <button
                className={`${activeFollowersStyle}`}
                onClick={handleFollowersBlock}
              >
                Followers
              </button>
            </div>

            <div className="right">
              <button
                className={`${activeFollowingsStyle}`}
                onClick={handleFollowingsBlock}
              >
                Followings
              </button>
            </div>
          </div>

          {/*  followers wrapper body */}
          <div className={`followers_wrapper___body ${followersBlock}`}>
            {followerUsers.map((user) => {
              return (
                // <div className="suggestion_item" key={user._id}>
                //   <div className="suggestion_item_left">
                //     <div className="suggestion_profile">
                //       <img
                //         src={
                //           user.profileImg
                //             ? `https://social-media-ankush.herokuapp.com/public/Images/${user.profileImg}`
                //             : `https://social-media-ankush.herokuapp.com/public/Images/user (1).png`
                //         }
                //         alt="profile"
                //       />
                //     </div>
                //     <div className="name">
                //       <p>{user.name}</p>
                //     </div>
                //   </div>
                //   <div className="follow_btn">
                //     <button>Follow</button>
                //   </div>
                // </div>
                <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id} />
                // <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id}/>
              );
            })}
          </div>

          {/* following wrapper body */}
          <div className={`followers_wrapper___body ${followingsBlock}`}>
            {followingUsers.map((user) => {
              return (
                // <div className="suggestion_item" key={user._id}>
                //   <div className="suggestion_item_left">
                //     <div className="suggestion_profile">
                //       <img
                //         src={
                //           user.profileImg
                //             ? `https://social-media-ankush.herokuapp.com/public/Images/${user.profileImg}`
                //             : `https://social-media-ankush.herokuapp.com/public/Images/user (1).png`
                //         }
                //         alt="profile"
                //       />
                //     </div>
                //     <div className="name">
                //       <p>{user.name}</p>
                //     </div>
                //   </div>

                //   <div className="follow_btn">
                //     <button>Unfollow</button>
                //   </div>
                // </div>
                <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id} />
                // <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id}  />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Followers;
