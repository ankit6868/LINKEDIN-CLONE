import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import DefaultLogo from '../../assets/defaultLogo.jpg'


function ConnectionsUserCard({user,loggedInUser}) {
    //   const [isRequestSent,setIsRequestSent] = useState(user.)
    const connectionStatus = user.connection_status;
    const navigate = useNavigate()
    let status = ''
    if(connectionStatus == 0)
        status = 'Pending'
    else if(connectionStatus == 1)
        status = 'Message'
   else
        status = 'Connect'

    const handleClick = ()=>{
      if(status==='Message')
        navigate(`/messaging/${user.receiver_user_id}`)
    }



  return (
     <div className="w-1/2 mx-auto sm:w-[250px]  rounded-md border bg-gray-300 shadow-lg my-3 pt-3">

      <Link to={`/profile/${user.receiver_user_id}`}>
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
          type="button" onClick={()=>handleClick()}
          className="my-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          
        >
          {status}
        </button>
      </div>
    </div>
  )
}

export default ConnectionsUserCard
