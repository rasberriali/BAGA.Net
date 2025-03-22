import React from 'react'
import xray_result from "../../../../images/xray_picture.png"

export default function BAGANETEvaluation() {
  return (
    <div>
        <div className='bg-white flex flex-row  p-6 rounded-lg '>
          <div className=' w-1/3  text-start  '>
              <img src={xray_result} alt="Xray_result" className=''></img>
          </div>
          <div className=' w-1/2 flex flex-col text-black  '>
            <div className='text-xl  font-bold'>
                Classified Disease:
            </div>
            <dzv className='text-base '>
                Classified Disease 
            </dzv>
          </div>    
          <div className=' w-1/6 flex flex-row justify-center items-end text-white   '>
          <button
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-900"
              >
                Generate
              </button>
          </div>    
        </div>
      
    </div>
  )
}
