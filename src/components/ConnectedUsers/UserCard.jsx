import React from 'react'
import { useNavigate,Link } from 'react-router-dom'
import DefaultLogo from '../../assets/defaultLogo.jpg'

function UserCard({user}) {

    const navigate = useNavigate()
    const handleClick = (receiver_user_id)=>{
      // console.log(user_id)
      if(receiver_user_id)
      navigate(`/messaging/${receiver_user_id}`)
    }

  return (
    <div className="w-1/2 mx-auto sm:w-[250px]  rounded-md border bg-gray-300   mt-5 pt-3">

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
          onClick={()=>handleClick(user.receiver_user_id)}
        >
          Message
        </button>
      </div>
    </div>
  )
}

export default UserCard
