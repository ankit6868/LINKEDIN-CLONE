import React from 'react'


function Loader() {
  let circleCommonClasses = 'h-5 w-5 bg-current   rounded-full';

    return (
        <div className='flex justify-center items-center h-[70vh]'>
            <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
            <div
                className={`${circleCommonClasses} mr-1 animate-bounce200`}
            ></div>
            <div className={`${circleCommonClasses} animate-bounce400`}></div>
        </div>
    );
  // return (
  //   <div className='flex justify-center items-center h-screen'>
  //       <PulseLoader color="#212121" />
  //   </div>

  // )
}

export default Loader
