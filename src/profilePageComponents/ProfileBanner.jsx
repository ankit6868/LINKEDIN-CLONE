import React,{useEffect, useState} from 'react'
import { useForm} from 'react-hook-form'
import supabase from '../supabse/supabaseConfig';
import { SUPABASE_BUCKET_URL } from '../constants/constants';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import DefaultLogo from '../assets/defaultLogo.jpg'
import { useDispatch } from 'react-redux';
import { setIsProfileCreated } from '../store/authSlice';


function ProfileBanner({user_id,isAuthor}) {

  const disptach = useDispatch()

  const [loading,setLoading] = useState(false)
  const [userData,setUserData] = useState(null)
  const navigate = useNavigate()
  //if a user has a profile id then he is updating existing 
  const [profile_id,setProfile_id]= useState(null)
  const [isUpdated,setIsUpdated] = useState(false)
  const [reload,setReload] = useState(true)
  const [prevImageUrl,setPrevImageUrl] = useState(null)//previously uploaded image's url
  const [submitted,setSubmitted] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [image,setImage] = useState(null)
  let uploadedImageUrl = null;
  const [showImagePreview,setShowImagePreview] = useState(null)

 
   const getUserData = async()=>{
      setLoading(true)
      
      let { data: profile, error } = await supabase
        .from('profile')
        .select('*')
        .eq('user_id',user_id)

        if(profile){

          // console.log(profile);
          // console.log(profile[0]);
          setUserData(profile[0])
          setProfile_id(profile[0]?.profile_id)
          setPrevImageUrl(profile[0]?.image_url)
        }
        else{
          console.log(error);
          navigate('/user-not-found')
          
        }
        setLoading(false);

          
    }


  useEffect(()=>{
    getUserData()
    
  },[isUpdated,submitted])

    // console.log(user_id);
     
    
    const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

     useEffect(() => {
    if (userData) {
      setValue('user_name', userData.user_name || '');
      setValue('headline', userData.headline || '');
      setValue('summary', userData.summary || '');
    }
  }, [userData]);

    // const [showModal, setShowModal] = useState(false);
    // const [image,setImage] = useState(null)
    // const [imagePath,setImagePath] = useState(null)
    

    const getImage = async(e)=>{
      const file = e.target.files[0];
      // console.log(file);
      const objectUrl = URL.createObjectURL(file)
      setShowImagePreview(objectUrl)
      setImage(file)

        //clear the memory 
      // URL.revokeObjectURL(objectUrl)

            
    }


    const submitForm = async(credentials)=>{
      setLoading(true)
      setIsUpdated(false)
      // console.log(image);

      if(image){

        if(profile_id){
          //if profile already exists then insert the profile_id which helps to remove generation of duplicate rows on updating the same user
          // credentials = {...credentials,profile_id:profile_id}
          // console.log('user  has image and profile_id');


        const {data,error} = await supabase.storage.from('profiles').update(user_id+'/profile_logo',image,{
          upsert:true
        })

        if(data){
          // console.log(data);
          // setImagePath(data.fullPath)

          uploadedImageUrl = data.fullPath;

          // console.log(uploadedImageUrl);
          // console.log('image uploaded successfully');
          // toast.success('Image uploaded successfully !!!')
          // setIsUpdated(!isUpdated)
        }else{
          console.log(error);
        }
      }
      else{
        //if user do not have a profile created then upload the images
          // console.log('user has no profile_id');

          const {data,error} = await supabase.storage.from('profiles').upload(user_id+'/profile_logo',image,{
          upsert:true
        })
        if(data){
          // console.log(data);
          // setImagePath(data.fullPath)

          uploadedImageUrl = data.fullPath;

          // console.log(uploadedImageUrl);
          // console.log('image uploade successfully');
          // toast.success('Image uploaded successfully !!!')
          // setIsUpdated(!isUpdated)
        }else{
          console.log(error);
        }
      }
      }





      if(uploadedImageUrl){
        // console.log('path of uploaded image', uploadedImageUrl);
        const image_url = SUPABASE_BUCKET_URL + uploadedImageUrl
        credentials = {...credentials,image_url:image_url}
        
      }else{
        // console.log('url of previous image',prevImageUrl);
        credentials = {...credentials,image_url:prevImageUrl}
      }


      credentials = {...credentials,user_id:user_id}

      if(profile_id){
        credentials= {...credentials,profile_id:profile_id}
      }
      // console.log('user credentials ',credentials);
      // console.log(image);


      const { data, error } = await supabase
          .from('profile')
          .upsert([credentials])
          .select()

          if(data){
            setReload(!reload)
            // console.log('updated',data);
            disptach(setIsProfileCreated(true))
            // setIsUpdated(true)
            toast.success('Successfully Updated profile')
          }else{
            console.log(error);
            toast.error(error.message)
          }
          setLoading(false)
          setReload(!reload)


        setLoading(false)
        setShowModal(false)
        setIsUpdated(true)
        // setIsUpdated(!isUpdated)

        // setReload(!reload)
        reset()

        setSubmitted(!submitted)
    }


    const handleConnectClick = ()=>{
      toast.success('Send your connection request in my network section !!!')
    }

 

      if(loading){
        return(
          null
        )
      }
      

        return (
         <div className='my-2'>
           
           <div className='bg-gray-200 py-5 mx-2 rounded-lg'>
            <div className='flex justify-between '>

             <img src={userData?.image_url || DefaultLogo} alt="profile_pic" className='w-44 h-44 rounded-full mt-5 ml-5' />
             {isAuthor && ( <button
             className="bg-gray-800 hover:bg-gray-700 h-10 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 ease-linear transition-all duration-150 mr-10 mt-5 "
             type="button"
             onClick={() => setShowModal(true)}
           >
            Edit
           </button>)}
            </div>

            <div className='ml-5 '>
              <h1 className='text-xl font-semibold'>{userData?.user_name || 'Your full name here'}</h1>
              <h2 className='text-md font-medium'>{userData?.headline || 'Your headline here'}</h2>
              <h3 className='text-md font-sans'>{userData?.connections|| '0'} connections | {userData?.followers || '0'} followers</h3>
              {!isAuthor &&
              <div className='flex mt-2'>
              <button className='bg-gray-800 text-slate-200 rounded-full py-2 px-4 mr-4' onClick={()=>(handleConnectClick())}>Connect</button>
              <button onClick={()=>(navigate(`/messaging/${user_id}`))} className='bg-gray-800 text-slate-200 rounded-full py-2 px-4 '>Message</button>
              </div>}
            </div>
     
           </div>
     
          {/* about/summary section */}
            <div className='my-4 mx-2 p-4 bg-gray-200 rounded-lg'>
              <h1 className='text-xl'>About :</h1>
                {userData?.summary}
                
            </div>
     
            
           {showModal ? (
             <>
               <div
                 className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
                 
               >
                 <div className="relative my-5 w-4/5">
                   {/*content*/}
                   <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-200 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                     {/*header*/}
                     <div className="flex items-start justify-between p-5 ">
                       <h3 className="text-3xl font-semibold"> 
                         Edit Intro
                       </h3>
                      
                       <button
                         className="p-1  ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                         onClick={() => setShowModal(false)}
                       >
                         <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                           ×
                         </span>
                       </button>
                     </div>
                      <span className='text-red-600 pl-5'>Note: All fields are required !!!</span>
                     {/*body*/}
                     <div className="relative p-6 flex-auto ">
                       
                       <form onSubmit={handleSubmit(submitForm)}>
                         <div className='my-2'>
                           <label htmlFor="" className="text-base font-medium text-gray-900 ">
                             {' '}
                             Enter your full name{' '}
                           </label>
                           <div className="">
                             <input 
                               className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                               type="text"
                               placeholder="Enter your full name"
                               name="user_name"
                               required
                                {...register("user_name", {
                                   required: "Email is required.",
                                 })}
                             ></input>
                             {errors.user_name && <p> username must be filled</p>
                             }
                           </div>
                         </div>
                          <div className='my-2'>
                           <label htmlFor="" className="text-base font-medium text-gray-900 ">
                             {' '}
                             Upload your profile image{' '}
                           </label>
                           <div className="">
                             <input 
                               className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                               type="file"
                               placeholder="Upload your profile image"
                               name="file"
                               accept='.jpg, .jpeg, .jfif, .pjpeg, .pjp, .png'
                               onChange={(e)=>(getImage(e))}
                               
                             ></input>
                             
                           </div>
                           {showImagePreview && 
                           <>
                           <p className='bg-blue-400 w-fit mx-auto text-center p-2 px-4 rounded-xl my-2'>Image Preview</p>
                           <img className='max-w-[200px] max-h-[200px] rounded-lg mx-auto ' src={showImagePreview} alt="profile_image_preview" />
                           </>}
                         </div>
                         <div className='my-2'>
                           <label htmlFor="" className="text-base font-medium text-gray-900 ">
                             {' '}
                             Enter headline{' '}
                           </label>
                           <div className="mt-2">
                             <input 
                               className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                               type="text"
                               placeholder="Enter your Headline"
                               name="headline"
                               required
                               {...register("headline", {
                                   required: "Headline is required.",
                                 })}
                             ></input>
                             
                           </div>
                         </div>
                         <div className='my-2'>
                           <label htmlFor="" className="text-base font-medium text-gray-900 ">
                             {' '}
                             Summary{' '}
                           </label>
                           <div className="mt-2">
                             <textarea
                               className="flex h-20 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                               type="text"
                               placeholder="Enter summary about you"
                               name="summary"
                               required
                               {...register("summary", {
                                   required: "Summary is required.",
                                 })}
                             ></textarea>
                             
                           </div>
                         </div>
                       <button
                         className="bg-gray-800 text-white active:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                         type="submit"
                         
                       >
                         Save Changes
                       </button>
                       </form>
                     </div>
                     {/*footer*/}
                
                   </div>
                 </div>
               </div>
               
             </>
           ) : null}
           
         </div>
       )
      
      
}

export default ProfileBanner

