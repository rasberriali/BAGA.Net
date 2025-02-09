import React from 'react'
import xray_result from "../../../images/xray_picture.png"

export default function DoctorsEvaluation() {
  return (
    <div>
        <div className='bg-white flex flex-row items-center p-6 rounded-lg '>
          <div className=' w-1/3  text-start  '>
              <img src={xray_result} alt="Xray_result" className=''></img>
          </div>
          <div className=' w-1/2 text-center text-red-600 '>
          Not yet evaluated by the doctor
          </div>
        </div>
      
    </div>
  )
}
