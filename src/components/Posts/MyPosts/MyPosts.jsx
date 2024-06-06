import React, { useEffect, useState } from 'react'
import supabase from '../../../supabse/supabaseConfig'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from './Post'
import Header from '../../Header/Header'
import Loader from '../../Loader/Loader'

function MyPosts() {
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const loggedInUser = useSelector((state)=>(state.auth.userId))
    
    const [posts,setPosts] = useState(null)


      const getAllPostsOfCurrentUser = async()=>{
        
        setLoading(true)
        //fetch the latest posts first
        let { data, error } = await supabase
        .rpc('get_all_posts_of_currentuser',{
          userid:loggedInUser
        })
        
        if(data){
            // console.log(data);
            const userPosts = data.filter(post =>  post.author_id === loggedInUser);
            setPosts(userPosts)

        }else{
            console.log(error);
        }

        setLoading(false)
        
    }


    useEffect(()=>{
      if(loggedInUser === null){
        navigate('/')
      }
        getAllPostsOfCurrentUser()
    },[])
  return (
    <div>
      <Header/>
      <h1 className='text-xl font-semibold text-center mt-3'>Your Posts </h1>

      {loading && <Loader/>}

     {!loading &&
      <div className='w-full  sm:max-w-xl  mt-2 mx-auto'>

      {posts && posts.map((post)=>(
        post.author_id === loggedInUser?
        <Post key={post.post_id} post={post}  />:null
      ))}

      {(!posts || posts.length == 0 ) &&
      <div className='bg-gray-300 px-4 py-2 mx-2 rounded-lg shadow-lg'>
        No posts. Create your post 
      </div>
      }
      </div>}
    </div>
  )
}

export default MyPosts
