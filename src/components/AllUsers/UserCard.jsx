import React, { Suspense, useState } from 'react'
import {Link} from 'react-router-dom'
import supabase from '../../supabse/supabaseConfig'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import DefaultLogo from '../../assets/defaultLogo.jpg'


function UserCard({user,loggedInUser}) {

  const [isRequestSent,setIsRequestSent] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const isProfileCreated = useSelector((state)=>(state.auth.isProfileCreated))

  const sendConnectionRequest = async(conn_user_id)=>{

    //only loggedin users can send connection requests
    if(loggedInUser === null || !isProfileCreated){
      // alert('please login to connect wiht people')
      setShowModal(true)
      return;
    }
    setIsRequestSent(true)

    let credentials = {user_id:loggedInUser,receiver_user_id:conn_user_id,connection_status:0}
    
    const { data, error } = await supabase
      .from('connections')
      .insert(credentials)
      .select()

      if(data){
        // console.log(data);
        toast.success('Request to connect sent successfully !!!')
      }else{
        console.log(error);
      }
          
  }
  return (
    <>
    
    <div className="w-1/2 mx-auto sm:w-[250px]  rounded-md border bg-gray-300 shadow-lg my-3 pt-3">

      <Link to={`/profile/${user.user_id}`}>
      <img
        src={user?.image_url || DefaultLogo}
        alt="user_profile_image"
        className="h-32 w-32 rounded-full mx-auto object-cover"
      />
        <h1 className="text-lg font-semibold hover:underline pt-2 text-center overflow-ellipsis">{user.user_name}</h1>

      </Link>
      <div className=" text-center">
        <p className=" text-sm text-gray-600">
        {user.headline}
        </p>
        <button
          type="button"
          className="my-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          onClick={()=>(sendConnectionRequest(user.user_id))}
        >
          {isRequestSent?'Pending':'Connect'}
        </button>
      </div>
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
                  {!loggedInUser &&  <h1 className='font-semibold mx-auto text-md'>Please Login to send connection request</h1>}
                  {loggedInUser && !isProfileCreated && 
                  <h1 className='font-semibold mx-auto text-md'>Please Complete your profile before sending requests</h1>
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
                      
                  { !loggedInUser && <Link to={`/login`}>
                  <button
                  className="bg-gray-800 text-white hover:bg-gray-700  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"                      
                  >
                  Login
                  </button>
                  </Link>}
                  {loggedInUser && !isProfileCreated && <Link to={`/profile/${loggedInUser}`}>
                  <button
                  className="bg-gray-800 text-white  hover:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none  mb-1 mr-2 ease-linear transition-all duration-150"                      
                  >
                  Create Profile
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

export default UserCard
