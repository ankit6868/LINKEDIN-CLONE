import React,{useEffect, useState} from 'react'
import moment from 'moment'
import parse from 'html-react-parser'
import { toast } from 'react-toastify';
import supabase from '../../../supabse/supabaseConfig';
import { useNavigate } from 'react-router-dom';
import DefaultLogo from '../../../assets/defaultLogo.jpg'

function Post({post}) {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    const deletePost = async()=>{
        
        const { error } = await supabase
        .from('posts')
        .delete()
        .eq('post_id', post.post_id)


        if(post.post_image_url){
          deleteImage(post.post_image_url)
        }

        

        if(error){
            console.log(error);
            toast.error(error.message)
        }else{
            // console.log('suceesfully deleted');
            toast.success('Post deleted successfully !!!')
        }

        setShowModal(false)
        navigate('/')
       
          
    }

    const deleteImage = async(post_image_url)=>{

      //split the image url
    const parts = post_image_url?.split("/");
  // Extract the last element
    if(parts.length >0){

      const user_bucket =parts[parts?.length - 2];
      const image_url = parts[parts?.length - 1];
      console.log(user_bucket);
      console.log(image_url);


      const { data, error } = await supabase
        .storage
        .from('posts')
        .remove([`${user_bucket}/${image_url}`])

        if(error){
          console.log(error);
        }
    }
      
    }
  return (
    <>
    
    <div key={post.post_id} className='bg-gray-200 my-4 mx-2 p-2 rounded-xl shadow-md'>
        
        <div className='flex '>
            <img src={post?.author_profile_url || DefaultLogo} className='rounded-full items-center my-auto mx-2 w-14 h-14' alt="author_profile_logo" />
            

            <div className='flex-col'>
            <p className='text-md font-semibold pt-1'>{post.author_name}</p>
            <p className='text-sm '>{post.author_headline}</p>
            <p className='text-xs '>{moment(post.post_date).fromNow()}</p>
            </div>
            <div className='ml-auto'>

            <button onClick={()=>(setShowModal(true))} className='justify-end bg-gray-800 hover:bg-gray-700 text-slate-200 font-semibold rounded-lg  p-2'>Delete</button>
            </div>
            
        </div>
        
        {/* <div className='py-2'>Posted at : {post.post_date}</div> */}
        <div className='py-2'>{parse(post.content)}</div>
        {post?.post_image_url &&   <img className='w-full rounded-xl  sm:max-w-xl max-h-[350px] mx-auto' src={post?.post_image_url} alt="" />}
    </div>

      {showModal ? (
          <>
          <div
            className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
          >
            <div className="relative my-5 max-w-2xl w-4/5">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-200 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 ">
                  
                  <h1 className='font-semibold mx-auto text-md'>You are deleting this post. This action cannot be undone !!!</h1>
                  

                  </div>
                  {/*body*/}               
                    <div className='flex mx-auto '>

                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 ml-2 mb-1 ease-linear transition-all duration-150"
                      onClick={()=>(deletePost())}
                      
                    >
                      Delete 
                    </button>
                      
                
                  <button
                  className="bg-gray-800 text-white hover:bg-gray-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"   
                  onClick={()=>(setShowModal(false))}                   
                  >
                  Back
                  </button>
                
                  
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

export default Post
