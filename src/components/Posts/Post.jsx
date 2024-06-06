import React, { Suspense, useEffect, useState } from 'react'
import supabase from '../../supabse/supabaseConfig'
import parse from 'html-react-parser'
import moment from 'moment'
import {Link} from 'react-router-dom'
import {ThumbsUp,MessageCircleMore } from 'lucide-react'
import ImageLoaderSkeleton from '../Loader/ImageLoaderSkeleton'
import { toast } from 'react-toastify'
import DefaultLogo from '../../assets/defaultLogo.jpg'



function Post({post,current_user_id,user_profile_exists}) {



    const [hasLiked,setHasLiked] = useState(post.has_liked);
    const [showComments,setShowComments] = useState(false)
    const [allComments,setAllComments] = useState(null)
    const [commentValue,setCommentValue] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [loading,setLoading] = useState(false)
    const [showDeleteCommentModal,setShowDeleteCommentModal] = useState(false)
    //states to handle comment deletion
    const [deleteCommentId,setDeleteCommentId] = useState(null)

    

     const handleLikeClick = async(postId,hasLiked)=>{
        //user cannot like the post if he is not logged in
        if(!current_user_id){
            // console.log("please login to like the post");
            toast.info('Please login to like the post !!!')
            return;
        }
        
        // console.log('current_user_id ',current_user_id);
        if(hasLiked){
            
            const { error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id',current_user_id)
            
            if(error){
                console.log(error);
            }else{

                setHasLiked(false);
                // console.log('like removed');
            }
            

        }
        else{
            // console.log('like added');
            const credentials = {post_id:postId,user_id:current_user_id}
            
            const { data, error } = await supabase
            .from('likes')
            .insert([
               credentials
            ])
            .select()

            if(data){
                // console.log(data);
                setHasLiked(true);
            }else{
                console.log(error);
            }
        }
        
    }



    const getAllComments = async(post_id,reloadComments = true)=>{

      setLoading(true)
      // console.log('loadinh tru');

        if(reloadComments){

          setShowComments(!showComments)
        }
        if(showComments && reloadComments){
            return
        }

        // let { data: comments, error } = await supabase
        // .from('comments')
        // .select('*')
        // .eq('post_id',postId)
        
        
        let { data, error } = await supabase
          .rpc('get_comments_details_with_authors', {
            postid:post_id
          })

        if(data){
          // console.log(data);
          setAllComments(data)
          // console.log('loading false');
          setLoading(false)
        }
        if(error){
          console.log(error);
        }
        

    }


    const uploadComment = async(postId)=>{

        // console.log(commentValue);
        if(commentValue.trim().length === 0){
          // alert('comment cannot be empty')
          toast.warning("Comment cannot be empty !")
          return;
        }
        if(!user_profile_exists){
            // alert('please complete your profile to comment');
            setShowModal(true)
            return;
        }
        const credentials = {user_id:current_user_id,post_id:postId,content:commentValue}
        setCommentValue('')

        const { data, error } = await supabase
        .from('comments')
        .insert([credentials])
        .select()

        if(data){
            // console.log(data);
          getAllComments(post.post_id,false)
        }else{
            console.log(error);
        } 
    }

    const deleteComment = async()=>{
      
      const commentId = deleteCommentId;

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('comment_id', commentId);

        if(error){
          toast.error(error.message);
        }else{
          toast.success('Comment deleted succesfully !!!')
        }

        getAllComments(post.post_id,false);

        setShowDeleteCommentModal(false)


          
    }


  return (
    <>
     <div key={post.post_id} className='bg-gray-200 my-4 mx-2 p-2 rounded-xl shadow-md'>

                <Link to={`/profile/${post.author_id}`}>
                <div className='flex '>
                    <img src={post?.author_profile_url || DefaultLogo} className='rounded-full items-center my-auto mx-2 w-14 h-14' alt="author_profile_logo" />
                    <div className='flex-col'>
                    <p className='text-md font-semibold pt-1'>{post.author_name}</p>
                    <p className='text-sm '>{post.author_headline}</p>
                    <p className='text-xs '>{moment(post.post_date).fromNow()}</p>
                    </div>
                </div>
                </Link>
                {/* <div className='py-2'>Posted at : {post.post_date}</div> */}
                <div className='py-2'>{parse(post.content)}</div>
                <Suspense fallback={<ImageLoaderSkeleton/>}  >

                {post.post_image_url &&   <img className='w-full rounded-xl  sm:max-w-xl max-h-[350px] mx-auto' src={post.post_image_url} alt="" />}
                </Suspense>
                <div className='flex justify-between py-2 '>
                    <button onClick={()=>(handleLikeClick(post.post_id,hasLiked))} className={`rounded-xl flex items-center font-semibold py-1 px-2 ${hasLiked? 'text-blue-500':''}`}><ThumbsUp className={`w-5 h-5 mr-1 ${hasLiked? 'fill-blue-500':''} `}/> Like</button>

                    <button className=' rounded-xl p-2 flex items-center font-semibold ' 
                    onClick={()=>(getAllComments(post.post_id))}><MessageCircleMore className='w-75 h-5 mr-1 '/>Comment</button>
                </div>

                <div className={`${showComments? 'block':'hidden'}`}>
         

                   {current_user_id && 
                   <div className='flex  mb-4'>
                        <input required value={commentValue} onChange={(e)=>setCommentValue(e.target.value)} type="text" placeholder='Enter your comment' className='py-2 w-full px-4 rounded-l-full outline-none bg-gray-100 border border-gray-900 ' />
                        <button onClick={()=>(uploadComment(post.post_id))} className='bg-gray-800 text-slate-200 hover:bg-gray-700 px-6  rounded-r-full' >Post</button>
                    </div>}
                    {current_user_id === null && <p className='bg-gray-400 p-2 py-1 my-1 rounded-xl '>Please login to comment</p>  }

                    {!loading &&

                    <div className='rounded-lg'>
                        
                        {allComments && allComments.length>0 && allComments.map((comment)=>(
                          <div key={comment.comment_id} className='p-2 my-2 bg-gray-300 rounded-lg'>
                              <div className='flex justify-between items-center'>
                                <Link to={`/profile/${comment.user_id}`}>
                                  <div className='flex'>
                                      <img className='w-10 h-10 items-center rounded-full m-1 mr-2' src={comment?.image_url || DefaultLogo} alt="comment_author_image" />
                                      <div className='flex-col'>
                                          <h1 className='text-sm font-semibold'>{comment.user_name}</h1>
                                          <h2 className='text-xs font-normal'>{comment.headline}</h2>
                                      </div>
                                  </div>
                                </Link>
                                <div className='flex items-center'>
                                  <p className='text-xs'>{moment(comment.comment_date).fromNow()}</p>
                                  <button onClick={()=>(setShowDeleteCommentModal(true), setDeleteCommentId(comment.comment_id))} className={`bg-black ${current_user_id == comment.user_id?'block':'hidden'} text-white p-2 ml-3 rounded-lg`}>Delete</button>

                                </div>
                              </div>
                              <div className='ml-2'>
                                  {comment.content}
                              </div>
                          </div>

                        ))}
                        {allComments && allComments.length === 0 && (

                            <p className='bg-gray-400 p-2 my-1 rounded-xl'>
                                No comments, be the first one to comment <br />
                            </p>
                        )}
                        
                    </div>
                    }
                    {loading &&
                      <h1>Loading ...</h1>
                    }
                </div>
        </div>

        {/* //modal to tell the user to login/update profile before commenting */}
        {showModal ? (
               <>
               <div
                 className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
                 
               >
                 <div className="relative my-5 max-w-2xl w-4/5">
                   {/*content*/}
                   <div className="border-0 rounded-lg shadow-xl relative flex flex-col w-full outline-none focus:outline-none bg-gray-300 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                       {/*header*/}
                       <div className="flex items-start justify-between p-5 ">
                        <h1 className='font-semibold mx-auto text-md'>Please complete your Profile in order to comment</h1>

                       </div>
                       {/*body*/}

                          
                          <div className='flex mx-auto '>

                         <button
                           className="bg-red-400 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 ml-2 mb-1 ease-linear transition-all duration-150"
                           onClick={()=>(setShowModal(false))}
                           
                         >
                           Cancel 
                         </button>
                           
                        <Link to={`/profile/${current_user_id}`}>
                        <button
                        className="bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"                      
                        >
                        Update Profile 
                        </button>
                        </Link>
                          </div>
                       {/*footer*/}
                  
                     </div>
                   </div>
                 </div>
                 
               </>
             )
              : null
        }

        {/* //model to show when user tries to delete his comments */}
        {showDeleteCommentModal ? (
               <>
               <div
                 className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
                 
               >
                 <div className="relative my-5 max-w-2xl w-4/5">
                   {/*content*/}
                   <div className="border-0 rounded-lg shadow-xl relative flex flex-col w-full outline-none focus:outline-none bg-gray-300 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                       {/*header*/}
                       <div className="flex items-start justify-between p-5 ">
                        <h1 className='font-semibold mx-auto text-md'>Do you want to delete your comment ?</h1>

                       </div>
                       {/*body*/}

                          
                        <div className='flex mx-auto '>

                        <button onClick={()=>(deleteComment())}
                        className="bg-gray-800 text-white hover:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"                      
                        >
                        Yes
                        </button>

                        <button
                           className="bg-red-400 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-2 ml-2 mb-1 ease-linear transition-all duration-150"
                           onClick={()=>(setShowDeleteCommentModal(false))}
                           
                         >
                           No 
                        </button>
                           

                        </div>
                       {/*footer*/}
                  
                     </div>
                   </div>
                 </div>
                 
               </>
             )
              : null
        }
    </>
  )
}

export default Post
