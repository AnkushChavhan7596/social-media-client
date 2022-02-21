import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Explore.css";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import SuggestionItem from "../../Components/SuggestionItem/SuggestionItem";

const Explore = ({ currentActiveUser }) => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState({});
  const [followTxt, setFollowTxt] = useState("Follow");
  const [unFollowTxt, setUnfollowTxt] = useState("Unfollow");

  ////////////////////////////////////
  //////////// get all users
  const getAllusers = async () => {
    try {
      const res = await axios.get("https://social-media-ankush.herokuapp.com/users");

      if (res.status === 200) {
         let exploreList = res.data.filter(user => !currentActiveUser.followings.includes(user._id))

         setUsers(exploreList.filter(user => user._id !== currentActiveUser._id))
      }

    } catch (error) {
      console.log(error);
    }
  };
  console.log(users)

  useEffect(() => {
    getAllusers();
  }, [currentActiveUser]);


  
  ////////////////////////////////////////
  ///////////// handle follow unfollow
  const handleFollowUnfollow = async (userID) =>{
      try{
          const res = await axios.post(`https://social-media-ankush.herokuapp.com/follow-unfollow`, { id : userID, token : Cookies.get("jwt")});

          if(res.status === 200){
              console.log(res.data.msg);
              console.log(res.data)

              if(res.data.follow){
                setFollowTxt("Unfollow");
                setUnfollowTxt("Unfollow")
                //  if(followTxt === "Follow"){
                //      setFollowTxt("Unfollow")
                //  }
                //  else{
                //      setFollowTxt("Follow")
                //  }
              }
              else{
                setFollowTxt("Follow");
                setUnfollowTxt("Follow")
                  // if(res.data.unfollow){
                  //     if(unFollowTxt === "Unfollow"){
                  //         setUnfollowTxt("Follow");
                  //     }else{
                  //         setUnfollowTxt("Unfollow");
                  //     }
                  // }
              }
          }
          else{
              if(res.data.followedYourSelf){
                  console.log("You can't follow yourself")
                  Swal.fire(
                      "Oops",
                      res.data.msg,
                      "info"
                  )
              }
              console.log(res.data.message);
          }

      }catch(error){
          console.log(error.message);
      }

  }

  return (
    <>
      <div className="explore">
        <div className="explore_heading">
          <h2>Explore Yourself</h2>
        </div>

        <div className="explore_users_wrapper">
          {users.map((user) => {
            return (
              // <div className="suggestion_item">
              //   <div className="suggestion_item_left">
              //     <div className="suggestion_profile">
              //       <img
              //         src={
              //           user.profileImg
              //             ? `${process.env.REACT_APP_IMAGE_PATH}${user.profileImg}`
              //             : `${process.env.REACT_APP_IMAGE_PATH}user (1).png`
              //         }
              //         alt="profile"
              //       />
              //     </div>

              //     <div className="name">
              //       <p>{user.name}</p>
              //     </div>
              //   </div>

              //   <div className="follow_btn">
              //     <button onClick={() =>{handleFollowUnfollow(user._id)} }>{ user.followers.includes(currentActiveUser._id) ? unFollowTxt : followTxt}</button>
              //   </div>
              // </div>

              <SuggestionItem user={user} currentActiveUser={currentActiveUser} key={user._id} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Explore;
