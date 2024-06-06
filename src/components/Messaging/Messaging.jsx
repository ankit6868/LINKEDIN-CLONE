import React, { useEffect, useState, useRef } from 'react';
import supabase from '../../supabse/supabaseConfig';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useParams,useNavigate,Link } from 'react-router-dom';
import { SendHorizontal  } from 'lucide-react';
import Header from '../Header/Header';
import Loader from '../Loader/Loader'
import DefaultLogo from '../../assets/defaultLogo.jpg'
import { toast } from 'react-toastify';

function Messaging() {

    const {receiver_user_id} = useParams()
    const navigate = useNavigate()
    // console.log(receiver_user_id);
    const loggedInUser = useSelector((state) => state.auth.userId);
    // console.log(loggedInUser);
    const isProfileCreated = useSelector((state)=>(state.auth.isProfileCreated))
   


    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState(null);
    const [isUpdated, setIsUpdated] = useState(false);
    const [receiverDetails,setReceiverDetails]  = useState(null)
    const messagesEndRef = useRef(null);
    const [loading,setLoading] = useState(false)


    useEffect(() => {
        if(!loggedInUser || !isProfileCreated || (loggedInUser === receiver_user_id)){
            navigate('/')
        }
        if(loggedInUser){

            getAllMessages();
            // getRecieverDetails()
        }
        
    }, [isUpdated]);

    useEffect(()=>{
        //get the receiver details only once
        if(loggedInUser){
            getRecieverDetails()
        }

    },[loggedInUser])

    const getRecieverDetails = async()=>{
        setLoading(true)
        
        let { data: profile, error } = await supabase
        .from('profile')
        .select('user_name,headline,image_url')
        .eq('user_id',receiver_user_id)

        // console.log('inside getReciever');

        if(profile){
            // console.log(profile);
            setReceiverDetails(profile[0])
        }else{
            console.log(error);
        }

        setLoading(false)
        
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        // console.log('message sent');
        // console.log(message);

        if(message.trim().length === 0){
            toast.warning("Message cannot be empty !")
            return
        }
        const credentials = { sender_user_id: loggedInUser, receiver_user_id: receiver_user_id, message: message };
        setMessage('');

        const { data, error } = await supabase
            .from('messages')
            .insert([credentials])
            .select();

        if (data) {
            // console.log(data);
            // setAllMessages(data)
        }
        if (error) {
            console.log(error);
        }

        setIsUpdated(!isUpdated);
    };

    const getAllMessages = async () => {
        
        let { data, error } = await supabase
        .rpc('get_all_messages', {
            receiveruserid:receiver_user_id,
            senderuserid:loggedInUser
        })
        
        if(data){
            // console.log(data);
            setAllMessages(data)
        }else{
            console.log(error);
        }

        setTimeout(()=>{

            scrollToBottom(); // Scroll to bottom after setting messages
        },10)
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth',block:'end', });
    };



    return (
        <>
        <Header/>
        {loading && <Loader/>}

        {!loading &&
            <div className='mx-1'>
                <p className='text-center text-xl mt-1  '>Chat with <span className='font-semibold'>{receiverDetails?.user_name}</span> </p>
            <div className=' max-w-xl mx-auto p-2 my-2 bg-gray-300 rounded-lg'>
              
              <Link to={`/profile/${receiver_user_id}`}>
                  <div className='flex'>
                      <img className='w-10 h-10 items-center rounded-full m-1 mr-2' src={receiverDetails?.image_url || DefaultLogo} alt="user_image" />
                      <div className='flex-col mt-2'>
                          <h1 className='text-sm font-semibold'>{receiverDetails?.user_name}</h1>
                          <h2 className='text-xs font-normal'>{receiverDetails?.headline}</h2>
                      </div>
                  </div>
              </Link>
          </div>
                <div className='max-w-xl h-[250px] sm:h-[320px] bg-gray-100 rounded-lg mx-auto flex flex-col overflow-auto'>
                    {allMessages && allMessages.length > 0 &&
                        allMessages.map((message) => (
                            <div
                                key={message.message_id}
                                className={`my-1 w-fit px-2 rounded-lg ${loggedInUser === message.sender_user_id ? 'ml-auto mr-2 bg-gray-300' : 'mr-auto ml-2 bg-slate-300'}`}
                            >
                                <p className='text-md max-w-[250px] sm:max-w-[500px] break-words '>{message.message}</p>
                                <span className='text-xs'>{moment(message.created_at).format('YYYY-MM-DD HH:mm')}</span>
                            </div>
                        ))}

                        {(!allMessages || allMessages.length == 0) &&
                            <p className='bg-gray-400 py-2 px-2 rounded-lg mx-1 my-5'>No messages. Start conversations ...</p>
                        }
                    <div ref={messagesEndRef} /> {/* This div ensures auto-scrolling */}
                </div>
                <form onSubmit={sendMessage} className='max-w-xl flex mx-auto mb-1 '>
                    <input value={message} placeholder='Enter your message' onChange={(e) => setMessage(e.target.value)} className='py-2 w-full px-4 rounded-l-lg outline-none bg-gray-100 border border-gray-900' type='text' />
                    <button type='submit' className='bg-gray-800 text-slate-200 hover:bg-gray-700 px-6  rounded-r-lg'>
                        <SendHorizontal />
                    </button>
                </form>
            </div>
        }
        </>
    );
}

export default Messaging;
