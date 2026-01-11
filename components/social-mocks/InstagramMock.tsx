import React from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface InstagramMockProps {
  content: string;
}

export const InstagramMock: React.FC<InstagramMockProps> = ({ content }) => {
  return (
    <div className="bg-black text-white rounded-[2rem] overflow-hidden w-full max-w-md mx-auto border border-gray-800 shadow-2xl">
      <div className="flex items-center p-4">
        <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full mr-3 p-[2px]">
          <div className="w-full h-full bg-black rounded-full border border-black flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-gray-800 rounded-full" />
          </div>
        </div>
        <p className="font-bold text-sm">Your Name</p>
      </div>
      <div className="bg-gray-900 aspect-square flex flex-col items-center justify-center relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-50" />
        <div className="relative z-10 text-center px-8">
           <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <span className="text-gray-500 text-2xl font-bold">AI</span>
           </div>
           <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Image Visualization</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-4">
            <Heart size={24} className="hover:text-pink-500 cursor-pointer transition-colors" />
            <MessageCircle size={24} className="hover:text-gray-400 cursor-pointer transition-colors" />
            <Send size={24} className="hover:text-sky-400 cursor-pointer transition-colors" />
          </div>
          <Bookmark size={24} className="hover:text-yellow-500 cursor-pointer transition-colors" />
        </div>
        <p className="text-[13px] leading-relaxed mb-1">
          <span className="font-bold mr-2 text-sm">your_handle</span>
          {content}
        </p>
        <p className="text-gray-500 text-[10px] mt-2 font-medium uppercase tracking-wider">Just now</p>
      </div>
    </div>
  );
};
