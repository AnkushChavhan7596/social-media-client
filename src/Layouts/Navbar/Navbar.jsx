import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Post from "../../Components/Post/Post";
import Cookies from "js-cookie";
import ExploreImg from "../../../src/Assets/Images/explore.png";

const Navbar = () => {
  const [posts, setPosts] = useState([]);
  const [searchResultContainerStyle, setSearchResultContainerStyle] =
    useState("hideSearch");
  const [searchValue, setSearchValue] = useState("");
  const [currentActiveUser, setCurrentActiveUser] = useState({});
  const [activeUser, setActiveUser] = useState({});

  /////////////////////////////////////////
  //////////// handle search result
  const handleSearchResult = () => {
    if (searchResultContainerStyle === "hideSearch") {
      setSearchResultContainerStyle("showSearch");
    } else {
      setSearchResultContainerStyle("hideSearch");
    }
  };

  ///////////////////////////////////////////
  ////////////// load posts
  const loadPosts = async () => {
    const res = await axios.get("https://social-media-ankush.herokuapp.com/all-posts");

    if (res.status === 200) {
      setPosts(res.data.reverse());
    } else {
      console.log("Something wents wrong");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  ////////////////////////////////////////////////////
  ////////////////// load active user
  const loadActiveUser = async () => {
    if (Cookies.get("jwt")) {
      try {
        const res = await axios.post(
          "https://social-media-ankush.herokuapp.com/get_active_user_by_token",
          { token: Cookies.get("jwt") }
        );

        if (res.status === 200) {
          setActiveUser(res.data.activeUser);
        } else {
          console.log(res.data.msg);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("User is not logged in");
    }
  };

  useEffect(() => {
    loadActiveUser();
  }, []);

  //////////////////////////////////////////////////////////////////
  /////////////////////// load current active user
  const loadCurrentActiveUser = async () => {
    const res = await axios.post(
      "https://social-media-ankush.herokuapp.com/get_active_user_by_token",
      { token: Cookies.get("jwt") }
    );
    if (res.status === 200) {
      setCurrentActiveUser(res.data.activeUser);
    } else {
      console.log(res.data.msg);
    }
  };

  useEffect(() => {
    loadCurrentActiveUser();
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="nav_left">
          <div className="logo">
            <Link to="/" className="logo_link">
              ShareFun
            </Link>
          </div>
          <div className="search_wrapper">
            <input
              type="text"
              placeholder="search something ..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onFocusCapture={handleSearchResult}
            />
            {searchValue !== "" ? (
              <i
                className="fas fa-times nav_search_icon"
                onClick={() => setSearchValue("")}
              ></i>
            ) : (
              <i className="fas fa-search nav_search_icon"></i>
            )}
          </div>
        </div>

        <div className="nav_right">
          <ul className="menu_links">
            <li title="home">
              <Link to="/" className="menu_link">
                <i className="fas fa-home home_icon"></i>
              </Link>
            </li>
            <li title="followers">
              <Link to="/followers" className="menu_link">
                <i className="fas fa-user-friends followers_icon"></i>
              </Link>
            </li>
            <li title="Explore">
              <Link to="/explore" className="menu_link">
              <img
                  className="explore_img"
                  src={
                    ExploreImg
                  }
                  alt=""
                />
              </Link>
            </li>
            <li title="create post">
              <Link to="/create-post" className="menu_link">
                <i className="far fa-plus-square create_icon"></i>
              </Link>
            </li>
            <li title="profile">
              <Link to="/profile" className="menu_link">
                <img
                  className="profile_round_img"
                  src={
                    activeUser.profileImg
                      ? `https://social-media-ankush.herokuapp.com/public/Images/${activeUser.profileImg}`
                      : `https://social-media-ankush.herokuapp.com/public/Images/user (1).png`
                  }
                  alt=""
                />
              </Link>
            </li>
          </ul>
        </div>

        <div
          className={`search_result_container ${searchResultContainerStyle}`}
        >
          {searchValue
            ? posts
                .filter((post) => {
                  return (
                    post.authorName
                      .trim()
                      .toLowerCase()
                      .includes(searchValue.trim().toLowerCase()) ||
                    post.title
                      .trim()
                      .toLowerCase()
                      .includes(searchValue.trim().toLowerCase())
                  );
                })
                .map((post) => {
                  return (
                    <Post
                      postData={post}
                      currentActiveUser={currentActiveUser}
                      key={post._id}
                    />
                  );
                })
            : ""}
        </div>
      </div>
    </>
  );
};

export default Navbar;
