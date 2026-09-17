import React from 'react';

export default function UserMessage({ message }) {
  return (
    <div className="flex justify-end my-6">
      <div className="bg-[#271F2E] dark:bg-[#8B5CF6] text-white px-6 py-3.5 rounded-3xl max-w-[80%] shadow-md shadow-[#271F2E]/10 dark:shadow-purple-950/40 text-base font-normal rounded-br-md leading-relaxed tracking-normal">
        {message}
      </div>
    </div>
  );
}
