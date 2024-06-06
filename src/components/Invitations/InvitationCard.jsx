import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import supabase from '../../supabse/supabaseConfig'
import {toast} from 'react-toastify'
import { Check,X } from 'lucide-react'
import DefaultLogo from '../../assets/defaultLogo.jpg'

function InvitationCard({invitation,loggedInUser}) {

    const [showInvitation,setShowInvitaion] = useState(true)

    const createConnection = async()=>{
        
        const { data, error } = await supabase
        .from('connections')
        .insert([
            {user_id:loggedInUser,receiver_user_id:invitation.user_id,connection_status:1},
        ])
        .select()

        if(data){
            // console.log(data);
            // console.log('two way connection established successfully ... ');
            toast.success('Connection accepted successfully ')
            setShowInvitaion(false)
        }else{
            console.log(error);
        }
          
    }

    const acceptInvitation = async(user_id)=>{

        //if the loggedIn user accepts the invitaion then we need to create an entry for him also in the connections table. Note: bcz connection is a two way relationship

        const credentials =  {user_id:invitation.user_id,receiver_user_id:loggedInUser,connection_status:1}

        const { data, error } = await supabase
        .from('connections')
        .upsert(credentials)
        .select()

        if(data){
            // console.log('connection_status updated');
            // console.log(data);
            createConnection()
            setShowInvitaion(false)
            toast.success('Connection request accepted !!!')

        }else{
            console.log(error);
            toast.error(error.message)
        }
                
    }

    const rejectInvitation = async()=>{
        //if we are rejecting the invitation then delete the entry from the table and send a push notification

        const credentials =  {user_id:invitation.user_id,receiver_user_id:loggedInUser,connection_status:-1}

        const { data, error } = await supabase
        .from('connections')
        .upsert(credentials)
        .select()

        if(data){
            // console.log(data);
            // console.log('connection rejected ');
            setShowInvitaion(false)
            toast.success('Connection request rejected !!!')
        }else{
            console.log(error);
            toast.error(error.message)
        }



    }

    const handleClick = async(status,user_id)=>{
        if(status == 1){
            // console.log('invitaion accepted');
            acceptInvitation(user_id)
            
        }else if(status == -1){
            // console.log('invitation rejected');
            rejectInvitation()
        }
    }

    if(showInvitation){

        return (
         <div key={invitation.profile_id} className='p-2 my-2 mx-2 bg-gray-300 rounded-lg'>
              <div className='flex justify-between items-center'>
              <Link to={`/profile/${invitation.user_id}`}>
                  <div className='flex'>
                      <img className='w-10 h-10 items-center rounded-full m-1 mr-2' src={invitation?.image_url || DefaultLogo} alt="user_image" />
                      <div className='flex-col mt-1'>
                          <h1 className='text-sm font-semibold'>{invitation.user_name}</h1>
                          <h2 className='text-xs font-normal'>{invitation.headline}</h2>
                      </div>
                  </div>
              </Link>
                  <div>
                      <button onClick={()=>(handleClick(1,invitation.user_id))} className='p-2 bg-green-100 hover:bg-green-300 rounded-full mr-2'><Check className='text-green-800' /></button>
                      <button onClick={()=>(handleClick(-1,invitation.user_id))} className='p-2 bg-red-100 hover:bg-red-300 rounded-full'><X className='text-red-600' /></button>
                  </div>
              </div>
          
          </div>
        )
    }
    else{
        return null;
    }
}

export default InvitationCard
