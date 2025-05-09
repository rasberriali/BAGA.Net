import React from 'react';

export default function Doctorsevaluation({ evaluation, findings }) {
  return (
    <div className="w-full">
      <div className="flex flex-col p-6 rounded-lg bg-gray-700 gap-4">
        <div className='text-2xl font-bold text-white'>Doctor's Evaluation:</div>
        <div className="w-full p-4 rounded-lg bg-gray-800 text-white">
          {evaluation ? (
            <div className="whitespace-pre-wrap">{evaluation}</div>
          ) : (
            <div className="text-gray-400 italic">No evaluation provided yet</div>
          )}
        </div>
        
        <div className='text-2xl font-bold text-white mt-4'>Findings:</div>
        <div className="w-full p-4 rounded-lg bg-gray-800 text-white">
          {findings ? (
            <div className="whitespace-pre-wrap">{findings}</div>
          ) : (
            <div className="text-gray-400 italic">No findings recorded yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
