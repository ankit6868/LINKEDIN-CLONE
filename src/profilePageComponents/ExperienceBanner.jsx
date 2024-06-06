import React,{useEffect, useState} from 'react'
import { useForm} from 'react-hook-form'
import supabase from '../supabse/supabaseConfig';
import { toast } from 'react-toastify';
import IndustryLogo from '../assets/industryLogo.jpg'

function ExperienceBanner({user_id,isAuthor}) {

    const [showModal, setShowModal] = useState(false);
    const [experiences,setExperiences] = useState(null);
    const [canDelete,setCanDelete] = useState(false)
    const [experienceId,setExperienceId] = useState(null)
    const [isUpdated,setIsUpdated] = useState(false)
    const [loading,setLoading] = useState(false)
    const [showAllExperiences,setShowShowAllExperiences] =useState(false)

    useEffect(()=>{
        getAllExperiences()
    },[isUpdated])

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    const toggleExperienceVisibility = ()=>{
      setShowShowAllExperiences(!showAllExperiences)
    }

    const getAllExperiences = async()=>{

        setLoading(true)
        
        let { data: experience, error } = await supabase
        .from('experience')
        .select('*')
        .eq('user_id',user_id)
        .order('experience_id',{ascending:false})

        if(experience){
            // console.log(experience);
            setExperiences(experience)
        }else{
            console.log(error);
        }

        setLoading(false)
                
    }

    const displayDefaultValues = (experience)=>{

        setExperienceId(experience.experience_id)

        setValue('user_id',experience.user_id)
        setValue('experience_id',experience.experience_id)
        setValue('company_name',experience.company_name)
        setValue('title',experience.title)
        setValue('location',experience.location)
        setValue('start_date',experience.start_date)
        setValue('end_date',experience.end_date)

        setShowModal(true);
        setCanDelete(true)
    }

    const deleteExperiences = async()=>{
        
        const { error } = await supabase
        .from('experience')
        .delete()
        .eq('experience_id', experienceId)

        if(error){
            console.log(error);
        }else{
            // console.log('successfully deleted expreience');
        }

        setIsUpdated(!isUpdated)
        setExperienceId(null)
        setCanDelete(false)
          
    }

    const submitForm = async(credentials)=>{
        credentials = {...credentials,user_id:user_id}
        // console.log(credentials);
        
        const { data, error } = await supabase
        .from('experience')
        .upsert(credentials)
        .select()

        if(data){
            // console.log(data);
            toast.success('Experience updated successfully !!!')
        }else{
            console.log(error);
            toast.error(error.message)
        }

        //reset the experience id after the form is submitted
        setExperienceId(null)
        reset()
        setShowModal(false)
        setIsUpdated(!isUpdated)
          
    }

    if(loading){
        return null;
    }

  return (
    <div className=' my-2 mx-2 bg-gray-200 py-2 px-2 rounded-lg'>

        <div className=' flex justify-between'>
              <h1 className='text-xl'>Experience  : </h1>
              {isAuthor && (<button className='bg-gray-800 hover:bg-gray-700  text-slate-200 rounded-lg py-1 px-4  my-1 ' onClick={()=>(setShowModal(true))} >Add</button>)}
        </div>

        {experiences && experiences.slice(0,showAllExperiences? experiences.length : 3 )
        .map((experience)=>(

        <div key={experience.experience_id} className='flex bg-gray-300  mb-4 rounded-lg pb-2'>
              <img className='h-12 w-12 mt-4 mx-2 rounded-full ' src={IndustryLogo} alt="school_logo" />
              <div className='flex-grow'>
                  <div className='flex justify-between'>
                      <p className='font-semibold pt-2 text-xl'>{experience?.company_name}</p>
                      {isAuthor && (<button onClick={()=>(displayDefaultValues(experience))} className='bg-gray-800 hover:bg-gray-700 py-1 px-3 text-slate-200 mr-5 mt-4 rounded-lg'>Edit</button>)}
                  </div>
                  <p className='font-semibold text-md'>{experience?.title}</p>
                  <p className='font-normal text-md'>{experience.location}</p>
                  <p className='font-normal text-md'>{experience?.start_date + ' - ' }{
                  experience?.end_date? experience.end_date : 'Present'}</p>
              </div>
        </div>
        ))}
  

        {experiences && experiences.length > 3 && (
                    <button className='text-slate-200  text-center bg-gray-700 hover:bg-gray-600 my-2 py-1 px-4 rounded-lg' onClick={toggleExperienceVisibility}>
                        {showAllExperiences ? 'Show Less Experience' : 'Show All Experience'}
                    </button>
                )}


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
                           Experience :
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
                                Company name{' '}
                             </label>
                             <div className="">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter Company name "
                                 name="company_name"
                                 required
                                  {...register("company_name", {
                                     required: "company_name is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>
                            <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               Job Title{' '}
                             </label>
                             <div className="">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter your job title "
                                 name="title"
                                  {...register("title", {
                                     required: "title is required.",
                                   })}
                                 
                               ></input>
                               
                             </div>
                           </div>
                           <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                               Location{' '}
                             </label>
                             <div className="mt-2">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter the job location "
                                 name="location"
                                 required
                                 {...register("location", {
                                     required: "location is required.",
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
                             </label><br />
                               <span className='text-red-500 text-sm '>Leave it blank if your currently working here</span>
                             <div className="mt-2">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600   bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="month"
                                 placeholder="choose date"
                                 name="end_date"
                                 
                                 {...register("end_date")}
                               ></input>
                               
                             </div>
                           </div>

                           <div className='flex justify-between'>

                           { canDelete && <button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                           onClick={deleteExperiences}
                           >
                            Delete experience
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
}

export default ExperienceBanner
