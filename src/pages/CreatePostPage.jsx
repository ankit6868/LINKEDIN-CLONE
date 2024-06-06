import React,{useState,useEffect,useRef,Suspense} from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {TINYMCE_API_KEY} from '../constants/constants'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import supabase from '../supabse/supabaseConfig'
import { v4 as uuidv4 } from 'uuid'
import { SUPABASE_BUCKET_URL } from '../constants/constants';
import { toast } from 'react-toastify';
import Header from '../components/Header/Header'
import Loader from '../components/Loader/Loader'

function PostPage() {

    const navigate = useNavigate();
    const user_id = useSelector((state) => state.auth.userId);
    const isProfileExists = useSelector((state)=>(state.auth.isProfileCreated))
    const [editorContent, setEditorContent] = useState('');

    const [selectedFile, setSelectedFile] = useState()
    const [preview, setPreview] = useState()
    const fileInputRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);


    useEffect(()=>{
        if(!isProfileExists){
            navigate('/')
        }
        handleEditorLoad()
    },[isProfileExists])


  const handleEditorChange = (newValue, editor) => {
    setEditorContent(newValue);
  };

  const handleEditorLoad = ()=>{
    setTimeout(()=>{
        setEditorLoaded(true)
    },1000)
  }


  const handleSubmit = async() => {
    // if(!isProfileExists){
    //     alert('please create your profile before posting...')
    // }
    // console.log(editorContent);
    // setPostContent(editorContent)

    let credentials = {user_id:user_id,content:editorContent}

    // console.log(credentials);
    setEditorContent('')

    if(selectedFile){

        const {data,error} = await supabase.storage.from('posts').upload(user_id+'/'+uuidv4(),selectedFile,{upsert:false
           })
   
           if(data){
            //    console.log(data.fullPath);
            //    setImageUrl(data.fullPath)
               const image_url = SUPABASE_BUCKET_URL+ data.fullPath
               credentials = {...credentials,image_url:image_url}
               
               toast.success('image uploaded successfully !!!')
               createPost(credentials)
           }else{
               console.log(error);
               toast.error(error.message)
           }
    }else{
        // credentials = {...credentials,image_url:null}
        createPost(credentials)
    }
  };

  const createPost = async(credentials)=>{
        const { data, error } = await supabase
        .from('posts')
        .upsert(credentials)
        .select()

        if(data){
            // console.log(data);
            toast.success('Post created successfully !!!')
            // console.log('post created');
            navigate('/feed')
        }
        if(error){
            console.log(error);
            toast.error(error.message)
        }
    }


  //image preview code


    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(null)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

     const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    


    if(!user_id){
        return(
            <h1>Please login to create post </h1>
        )
    }

  return (
    <>

        <Header/>
        <div className=' max-w-xl mx-auto '>
            <h1 className=' py-2  text-2xl font-semibold rounded-lg px-5 w-full text-center'>Create your post </h1>

        <div className='mx-2'>

            {editorLoaded?(

            <Editor
                apiKey={TINYMCE_API_KEY}
                init={{
                    plugins: 'autolink charmap emoticons link lists searchreplace table visualblocks wordcount linkchecker  ',
                    toolbar: 'undo redo | link bold italic underline strikethrough | spellcheckdialog a11ycheck typography | align lineheight |  numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                        { value: 'First.Name', title: 'First Name' },
                        { value: 'Email', title: 'Email' },
                    ],
                    placeholder: 'Write your post here...', // Add placeholder text here
                }}
                onEditorChange={handleEditorChange}
                value={editorContent}
                
            />
            ):(<Loader/>)}

          

            <div className='flex flex-col'>
                <input type='file' style={{ display: 'none' }} ref={fileInputRef} onChange={onSelectFile} />
                <button onClick={handleImageUpload} className=' bg-gray-700 hover:bg-gray-600 text-slate-100 py-2 px-4 rounded-full  my-2'>Upload Image</button>
                {selectedFile && 
                    <div className='mx-auto '>
                        <p className='bg-gray-600 text-slate-300 text-center p-2 rounded-lg'>Image Preview :</p>
                        <img src={preview} className='max-w-[300px] max-h-[300px] my-4' /> 
                    </div>
                }
            </div>

            <button onClick={handleSubmit} className='bg-gray-700 hover:bg-gray-600 text-slate-100 w-full py-2 px-4 mb-5 rounded-full'>Create Post </button>
            </div>
        </div>


    </>
  )
}

export default PostPage
