import React, { useEffect, useState } from 'react'
import supabase from '../../supabse/supabaseConfig'
import { Link,useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import { useSelector } from 'react-redux'
import Loader from '../Loader/Loader'
import DefaultLogo from '../../assets/defaultLogo.jpg'

function MessageUsersList() {

    const loggedInUser = useSelector((state)=>(state.auth.userId))
    const isProfileCreated = useSelector((state)=>(state.auth.isProfileCreated))
    const [showModal, setShowModal] = useState(false);
    const [allUsers,setAllUsers] = useState(null)
    const [loading,setLoading] = useState(false)
    
    const navigate = useNavigate()

    const getAllUsers = async()=>{

      setLoading(true)
        let { data: profile, error } = await supabase
        .from('profile')
        .select('headline,image_url,profile_id,user_id,user_name')
        

        if(profile){
          // console.log(profile);
          setAllUsers(profile)
            
        }else{
          console.log(error);
        }

        setLoading(false)
          
    }

    useEffect(()=>{
        getAllUsers()
    },[])

    const handleClick = (user_id)=>{
        if(!loggedInUser || !isProfileCreated){
            setShowModal(true)
        }else{
            navigate(`/messaging/${user_id}`)
        }
    }
  return (

    <>
    <Header/>
    
    {loading && <Loader/>  }
    <div className='max-w-xl mx-auto mt-5'>

      {/* //conditional mapping so that the current loggedin user is not displayed */}
        {!loading &&  allUsers && allUsers.length &&
        allUsers
        .map((user)=> (
          // using the hidden class hide the loggedin user details
           <div key={user.profile_id} className={`p-2  my-3 mx-2 bg-gray-300 rounded-lg shadow-lg ${user.user_id == loggedInUser?'hidden':''}`}>
                <div className='flex justify-between items-center'>
                <Link to={`/profile/${user.user_id}`}>
                    <div className='flex'>
                        <img className='w-12 h-12 items-center rounded-full m-1 mr-2' src={user?.image_url || DefaultLogo} alt="user_image" />
                        <div className='flex-col mt-2'>
                            <h1 className='text-sm font-semibold'>{user.user_name}</h1>
                            <h2 className='text-xs font-normal'>{user.headline}</h2>
                        </div>
                    </div>
                </Link>
                    <div>
                        <button onClick={()=>handleClick(user.user_id)}  className='py-2 px-4 text-slate-200 bg-gray-800 hover:bg-gray-700 rounded-xl  mr-2'>Message</button>
                    </div>
                </div>
            
            </div>
        )
        
        )}

      
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
                  {!loggedInUser &&  <h1 className='font-semibold mx-auto text-md'>Please Login to send messages</h1>}
                  {loggedInUser && !isProfileCreated && 
                  <h1 className='font-semibold mx-auto text-md'>Please Complete your profile before to send messages</h1>
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

export default MessageUsersList
