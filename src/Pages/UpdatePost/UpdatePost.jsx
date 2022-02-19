import React , { useState, useEffect } from "react";
import "./UpdatePost.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const UpdatePost = () =>{
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState({});

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [postImage, setPostImage] = useState([]);

    const onChangeFile = (e) =>{
        setPostImage(e.target.files[0]);
    }



    /////////////////////////////////////////////
    ////////////////////// handle submit
    const handleFormSubmit = (e) =>{
        e.preventDefault();

        let formData = new FormData();

        formData.append("title",title);
        formData.append("description", description);
        formData.append("postImage", postImage);
        formData.append("token", Cookies.get("jwt"));

        console.log(formData)

        setTitle("");
        setDescription("");
        
        axios.post(`http://localhost:8000/post/update/${id}`, formData, {
            headers: {
                "Content-type": "multipart/form-data",
            },                    
        }).then((res)=>{
            
            if(res.status === 200){
                console.log(res.data.msg);

                Swal.fire(
                    "Greate",
                    res.data.msg,
                    "success"
                )

                navigate("/", {replace : true});

            }
            else{
                console.log(res.data.msg);
                Swal.fire(
                    "Oops",
                    res.data.msg,
                    "info"
                )

                navigate(`/update-post/${id}`, {replace : true});
            }
        })
    }



    //////////////////////////////////////////
    ///////////// load post data
    const loadPost = async () =>{
        try{
            const res = await axios.post(`http://localhost:8000/get_post_by_id/${id}`);

            if(res.status === 200){
                console.log(res.data.post);
                setTitle(res.data.post.title);
                setDescription(res.data.post.description);
                setPost(res.data.post);
            }
        }
        catch(error){
            console.log(error);
        }

    }

    useEffect(()=>{
        loadPost();
    },[]);


    return(
        <>
           <div className="createPost">
              <div className="create_post_wrapper">

                     <div className="form_heading">
                         <h2>Update Post</h2>
                     </div>

                     <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                        <div className="input_field">
                            <label htmlFor="title">Post Title : </label>
                            <input type="text" id="title" value={title} onChange={(e) => {setTitle(e.target.value)}} name="title" placeholder="Enter post title" required/>
                        </div>

                        <div className="input_field">
                            <label htmlFor="description">Post Description : </label>
                            <textarea name="description" id="description" value={description} onChange={(e) => {setDescription(e.target.value)}} rows="4"  placeholder="Enter post description" required></textarea>
                            {/* <input type="text" id="description" name="description" placeholder="Enter post description"/> */}
                        </div>

                        <div className="input_field">
                            <label htmlFor="postImage"> Post Image : </label>
                            <input type="file" id="postImage" name="postImage" onChange={onChangeFile} required/>
                        </div>

                        <div className="post_btn">
                            <button type="submit">Update</button>
                        </div>


                     </form>

              </div>
           </div>
        </>
    )
}

export default UpdatePost;