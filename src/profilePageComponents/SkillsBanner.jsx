import React, { useEffect, useState } from 'react';
import { useForm} from 'react-hook-form'
import supabase from '../supabse/supabaseConfig';
import { toast } from 'react-toastify';


function SkillsBanner({ user_id, isAuthor }) {

    const [skills,setSkills] = useState(null)
    const [isUpdated,setIsUpdated] = useState(false)
    const [skillId,setSkillId] = useState(null)
    const [canDelete,setCanDelete] = useState(false)
    const [loading,setLoading] = useState(false)
   
    useEffect(()=>{
        getAllSkills()
    },[isUpdated])

    const getAllSkills = async()=>{

        setLoading(true)

        let { data: skills, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id',user_id)
        .order('skills_id',{ascending:true})

        if(skills){
            // console.log(skills);
            setSkills(skills)
        }
        else{
            console.log(error);
        }

        setLoading(false)
          
    }

  
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm();

    const [showModal, setShowModal] = useState(false);

    const [showAllSkills, setShowAllSkills] = useState(false);

    const toggleSkillsVisibility = () => {
        setShowAllSkills(!showAllSkills);
    };


      const editSkills  = (skill)=>{
        setSkillId(skill.skills_id)
        setValue('skill_name',skill.skill_name);
        setValue('skills_id',skill.skills_id)
        setShowModal(true)
        setCanDelete(true)
    }

    const deleteSkill = async()=>{
        
        const { error } = await supabase
        .from('skills')
        .delete()
        .eq('skills_id', skillId)

        if(error){
            console.log(error);
            toast.error(error.message)
        }else{
            toast.success('Skill successfully deleted !!!')
        }

        setCanDelete(false)
        setShowModal(false)
        setSkillId(null)
                
    }
    
    const submitForm = async(credentials)=>{

        credentials = {...credentials,user_id:user_id}

         const { data, error } = await supabase
          .from('skills')
          .upsert([
              credentials
          ])
          .select()

          if(data){
            // console.log(data);
            toast.success('Skill updated successfully !!!')
            setIsUpdated(!isUpdated)
          }else{
            console.log(error);
            toast.error(error.message)
          }

          setSkillId(null)
        
 
          
        reset()
        setShowModal(false)

    }

    if(loading){
      return null
    }

    return (
        <div className=' my-2 mt-4'>
            <div className='bg-gray-200 p-2 rounded-lg mx-2'>
                <div className='flex justify-between mt-1 mb-3'>
                    <h1 className='text-xl py-1'>Skills :</h1>
                    {isAuthor &&  <button onClick={()=>(setShowModal(true))} className='bg-gray-800  hover:bg-gray-700 text-slate-200 py-1 px-4 rounded-lg'>Add</button>}
                </div>
                {skills && skills.slice(0, showAllSkills ? skills.length : 4).map((skill) => (
                    <div className=' border-b-2 border-gray-400 px-1' key={skill.skills_id}>
                        <div className='flex justify-between'>
                            <p className='py-2'>{skill.skill_name}</p>
                            { isAuthor && <button onClick={()=> editSkills(skill)} className='bg-gray-800  hover:bg-gray-700 text-slate-200 my-2 py-0.5 px-2 rounded-lg'>Edit</button>}
                        </div>
                        
                    </div>
                ))}
                {skills && skills.length > 4 && (
                    <button className='text-slate-200  text-center bg-gray-700 hover:bg-gray-600 my-2 py-1 px-4 rounded-lg' onClick={toggleSkillsVisibility}>
                        {showAllSkills ? 'Show Less Skills' : 'Show All Skills'}
                    </button>
                )}
            </div>

            { /*Modal logic*/}
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
                          Skills :
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
                       {/*body*/}
                       <div className="relative p-6 flex-auto  ">
                         
                         <form onSubmit={handleSubmit(submitForm)}>
                           <div className='my-2'>
                             <label htmlFor="" className="text-base font-medium text-gray-900 ">
                               {' '}
                                Enter you skills {' '}
                             </label>
                             <div className="">
                               <input 
                                 className="flex h-10 w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-800   focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                 type="text"
                                 placeholder="Enter skills "
                                 name="skill_name"
                                 required
                                  {...register("skill_name", {
                                     required: "skill name is required.",
                                   })}
                               ></input>
                               
                             </div>
                           </div>
                         
                          
                          
                          { canDelete &&   <button
                           className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                           onClick={deleteSkill}
                           
                         >
                           Delete this skill 
                         </button>}
                           
                           
                         <button
                           className="bg-gray-800 text-white active:bg-gray-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                           type="submit"
                           
                         >
                           Save 
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
    );
}

export default SkillsBanner;
