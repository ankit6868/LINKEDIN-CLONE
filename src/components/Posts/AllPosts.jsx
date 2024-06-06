import React, { useEffect, useState,useMemo } from 'react'
import supabase from '../../supabse/supabaseConfig'
import parse from 'html-react-parser'
import moment from 'moment'
import {Link,useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import Post from './Post'
import Header from '../Header/Header'
import PostPage from '../../pages/CreatePostPage'
import Loader from '../Loader/Loader'

function AllPosts() {

    const current_user_id = useSelector((state)=>(state.auth.userId))

    const [posts,setPosts] = useState([])
    const [showModal, setShowModal] = useState(false);
    // const [userProfileExists,setUserProfileExists] = useState(false)
    const isProfileCreated = useSelector((state)=>(state.auth.isProfileCreated))
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)

    const getAllPostswithAuthors = async()=>{
        
        setLoading(true)
        //fetch the latest posts first
        let { data, error } = await supabase
        .rpc('get_post_details')

        if(data){
            // console.log(data);
            setPosts(data)

        }else{
            console.log(error);
        }

        setLoading(false)
        
    }

    const getAllPostsWithAuthorsAndLikes = async()=>{

      setLoading(true)

        let { data, error } = await supabase
        .rpc('get_post_details_with_likes',{current_user_id})

        if(data){
            // console.log('response with likes');
            // console.log(data);
            setPosts(data)

        }else{
            console.log(error);
        }

        setLoading(false)
    }

  

    const handleClick = ()=>{
        if(!isProfileCreated){
            setShowModal(true)
        }else{
            navigate('/createpost')
        }
    }

   
    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          if (current_user_id) {
              // console.log('User present');
              await getAllPostsWithAuthorsAndLikes();
          } else {
              // console.log('User absent');
              await getAllPostswithAuthors();
          }
          setLoading(false);
      };

      fetchData();
    }, [current_user_id]);

    const memoizedPosts = useMemo(() => posts, [posts]);



    //IIFE function to check if the user has created profile or not 



  return (
    <>
    <Header/>
    {/* <PostPage/> */}
    {loading && <Loader/> }

   {!loading &&
    <div className='w-full  sm:max-w-xl  mt-2 mx-auto'>
        <div className='flex  justify-center'>

       {current_user_id && 
            <button  className='py-2 block mr-2 text-md bg-gray-800 hover:bg-gray-700 text-slate-200 rounded-full px-5 sm:px-10'
            onClick={handleClick}
            >Create Post</button>
       }
        {current_user_id && 
            <button  className='py-2 block ml-2 text-md bg-gray-800 hover:bg-gray-700 text-slate-200 rounded-full px-5 sm:px-10'
            onClick={()=>(navigate('/myposts'))}
            >My Posts</button>
       }
        {!current_user_id && 
            <button  className='py-2 block ml-2 text-md bg-gray-800 hover:bg-gray-700 text-slate-200 rounded-full px-5 sm:px-10'
            onClick={()=>(navigate('/login'))}
            >Please login to create posts</button>
       }
        </div>

    

        {memoizedPosts && memoizedPosts.map((post)=>(

           <Post key={post.post_id} post={post} current_user_id={current_user_id} user_profile_exists={isProfileCreated} />
        ))}
    </div>}


     {showModal ? (
               <>
               <div
                 className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
                 
               >
                 <div className="relative my-5 max-w-2xl w-4/5">
                   {/*content*/}
                   <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-300 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                       {/*header*/}
                       <div className="flex items-start justify-between p-5 ">
                       
                        {!isProfileCreated && 
                        <h1 className='font-semibold mx-auto text-md'>Please Complete your profile to create post</h1>
                        }

                       </div>
                       {/*body*/}

                          
                          <div className='flex mx-auto '>

                         <button
                           className="bg-red-400 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 ml-2 mb-1 ease-linear transition-all duration-150"
                           onClick={()=>(setShowModal(false))}
                           
                         >
                           Cancel 
                         </button>
                           
                        {<Link to={`/profile/${current_user_id}`}>
                        <button
                        className="bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"                      
                        >
                        Complete Profile
                        </button>
                        </Link>}
                        
                          </div>
                       {/*footer*/}
                  
                     </div>
                   </div>
                 </div>
                 
               </>
             ) : null}
 
    </>
  )
}



export default AllPosts
