import React,{useEffect, useState} from 'react'
import SchoolLogo from '../assets/schoolLogo.png'
import { useForm} from 'react-hook-form'
import supabase from '../supabse/supabaseConfig';
import { toast } from 'react-toastify';
import Loader from '../components/Loader/Loader';

function EducationBanner({user_id,isAuthor}) {

  const [loading,setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm();

  const [showModal, setShowModal] = useState(false);
  const [schoolData,setSchoolData] = useState([])
  const [isUpdated,setIsUpdated] = useState(null)
  const [educationId,setEducationId] = useState(null)
  const [canDelete,setCanDelete] = useState(false)

  const getEductionData = async()=>{
    setLoading(true)
    
    let { data: education, error } = await supabase
    .from('education')
    .select('*')
    .eq('user_id',user_id)
    .order('education_id',{ascending:false})
    

    if(education){
        // console.log(education);
        setSchoolData(education)
    }
    else{
        console.log(error);
    }  
    
    setLoading(false)
  }

  useEffect(()=>{
    getEductionData()
  
  },[isUpdated])

    const deleteEducationDetails = async()=>{
      
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('education_id', educationId)

        if(error){
          console.log(error);
          setIsUpdated(!isUpdated)
        }else{
          // console.log('successfully deleted experience');
        }

        setCanDelete(false);
        reset()
        setEducationId(null)
                
    }

  const submitForm = async(credentials)=>{
    credentials = {...credentials,user_id:user_id}

    // console.log(credentials);
    
    const { data, error } = await supabase
    .from('education')
    .upsert([
        credentials
    ])
    .select()
    

    if(data){
        // console.log(data);
        toast.success('Education details Updated')
        setShowModal(false)
        setIsUpdated(!isUpdated)
    }
    else{
        console.log(error);
        toast.error(error.message)
    }

    reset()
    setEducationId(null)
          
  }

  const displayDefaultValues =(school)=>{
    setShowModal(true);
    setCanDelete(true);

    if(school){

      setEducationId(school.education_id)

      setValue('school_name',school.school_name || '')
      setValue('education_id',school.education_id || '')
      setValue('degree',school.degree || '')
      setValue('grade',school.grade || '')
      setValue('start_date',school.start_date || '')
      setValue('end_date',school.end_date || '')
      setValue('user_id',school.user_id || '')
    }
  }

  if(!loading){

    return (
      <div className=' my-2 mx-2 bg-gray-200 py-2 px-2 rounded-lg'>
  
  
          <div className=' flex justify-between'>
              <h1 className='text-xl '>Education  : </h1>
              {isAuthor && (<button className='bg-gray-800 hover:bg-gray-700 text-slate-200 rounded-lg py-1 px-4  my-1 ' onClick={()=>(setShowModal(true))} >Add</button>)}
          </div>
         {schoolData && schoolData.map((school)=>(
  
          <div key={school.education_id} className='flex bg-gray-300  mb-4 rounded-lg pb-2'>
              <img className='h-10 w-10 mt-4 mx-2 rounded-md ' src={SchoolLogo} alt="school_logo" />
              <div className='flex-grow'>
                  <div className='flex justify-between'>
                      <p className='font-semibold pt-2 text-xl'>{school?.school_name}</p>
                      {isAuthor && (<button onClick={()=>(displayDefaultValues(school))} className='bg-gray-800 hover:bg-gray-700 py-1 px-3 text-slate-200 mr-5 mt-4 rounded-lg'>Edit</button>)}
                  </div>
                  <p className='font-semibold text-md'>{school?.degree}</p>
                  <p className='font-normal text-md'>{school?.start_date +' - ' + school?.end_date}</p>
                  <p className='font-normal text-md'>Grade : {school?.grade}</p>
              </div>
          </div>
         ))
          }
  
          {showModal ? (
               <>
               <div
                 className="justify-center items-center flex   fixed inset-0 z-50 outline-none focus:outline-none  "
               >
                 <div className="relative my-5 w-4/5">
                   {/*content*/}
                   <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none bg-gray-200 mt-10 max-h-screen my-5 overflow-y-auto overflow-x-hidden  ">
                       {/*header*/}
                       <div className="flex items-start justify-between p-5">
                         <h3 className="text-3xl font-semibold"> 
                          Education details :
                         </h3>
                        
                         <button
                           className="p-1  ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                           onClick={() => (setShowModal(false),reset(),setCanDelete(false))}
                         >
                           <span className="bg-transparent text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                             ×
                           </span>
                         </button>
                       </div>
                        <span className='text-red-600 pl-5'>Note: All fields are required !!!</span>
                       {/*body*/}
                       <div className="relative p-6 flex-auto  ">
                         
                         <form onSubmit={handleSubmit(submitForm)}>
                           <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                                School name{' '}
                             </label>
                             <div className="">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter School name "
                                 name="school_name"
                                 required
                                  {...register("school_name", {
                                     required: "school name is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>
                            <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               Degree{' '}
                             </label>
                             <div className="">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter your degree "
                                 name="degree"
                                  {...register("degree", {
                                     required: "degree is required.",
                                   })}
                                 
                               ></input>
                               
                             </div>
                           </div>
                           <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               Grade{' '}
                             </label>
                             <div className="mt-2">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="ex: 85% or 8.4 CGPA "
                                 name="grade"
                                 required
                                 {...register("grade", {
                                     required: "grade is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>
                            <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               Start Date{' '}
                             </label>
                             <div className="mt-2">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="month"
                                 placeholder="choose date"
                                 name="start_date"
                                 required
                                 {...register("start_date", {
                                     required: "date is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>
                             <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               End Date{' '}
                             </label>
                             <div className="mt-2">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="month"
                                 placeholder="choose date"
                                 name="end_date"
                                 required
                                 {...register("end_date", {
                                     required: "date is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>

                           <div className='flex justify-between'>

                          {canDelete && <button className='bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                          onClick={deleteEducationDetails}
                          >
                            Delete Education
                           </button>}
                           
                         <button
                           className="bg-gray-800 text-white active:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                           type="submit"
                           
                         >
                          Save 
                         </button>
                           </div>
                           
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
  }else{
    return <Loader/>;
  }
}

export default EducationBanner
