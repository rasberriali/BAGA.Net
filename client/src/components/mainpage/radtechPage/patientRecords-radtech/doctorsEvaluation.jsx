import React from 'react';

export default function DoctorsEvaluation({ evaluation }) {
  return (
    <div>
      <div className="flex flex-col p-6 rounded-lg h-[30vh] bg-white gap-2">
        <div className='text-2xl font-bold text-black'>Findings:</div>
       <div className="w-full text-center text-red-600 flex flex-row ">
          {evaluation ? evaluation : "Not yet evaluated by the doctor"}
        </div>
      </div>
    </div>
  );
}
