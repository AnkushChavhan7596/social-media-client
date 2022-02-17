import React from "react";
import "./FriendsPost.css";
import Img1 from "../../Assets/Images/amirhossein-soltani-JCyGsKePWNs-unsplash.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from "react-router-dom";

// css
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const FriendsPost = ({posts}) =>{
    return(
        <>
           <div className="friends_posts">
                            <Swiper
                                    spaceBetween={10}
                                    slidesPerView={5}
                                    // onSlideChange={() => console.log('slide change')}
                                    // onSwiper={(swiper) => console.log(swiper)}  
                                     className='swiper'
                                    >

                                   {
                                      posts.map((post)=>{
                                         return(
                                             <SwiperSlide className='slide' key={post._id}>
                                                 <Link to={`/comments/${post._id}`}>
                                                     <img src={`${process.env.REACT_APP_IMAGE_PATH}${post.postImage}`} alt="img" />
                                                  </Link>
                                             </SwiperSlide>
                                         )
                                      })
                                   }
                                 
                                  
                            </Swiper>
                     </div>
        </>
    )
}

export default FriendsPost;