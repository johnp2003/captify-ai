import React from 'react';
import { ThumbsUp, MessageSquare, Repeat, Send } from 'lucide-react';

interface LinkedInMockProps {
  content: string;
}

export const LinkedInMock: React.FC<LinkedInMockProps> = ({ content }) => {
  return (
    <div className="bg-[#1b1f23] text-[#e1e9ee] rounded-[2rem] p-6 w-full max-w-md mx-auto border border-gray-800 shadow-2xl">
      <div className="flex items-center mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg mr-4 border border-gray-800 shadow-lg"></div>
        <div>
          <p className="font-bold text-base leading-tight">Your Name</p>
          <p className="text-gray-400 text-xs mt-1">Thought Leader @ Captify AI • 1st</p>
          <p className="text-gray-500 text-[10px] mt-0.5 uppercase tracking-wider font-bold">Just now • Edited</p>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-800 text-gray-400">
        <div className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer transition-colors group">
           <ThumbsUp size={18} className="group-hover:text-blue-400" />
           <span className="text-xs font-bold group-hover:text-blue-400">Like</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer transition-colors group">
           <MessageSquare size={18} />
           <span className="text-xs font-bold">Comment</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer transition-colors group">
           <Repeat size={18} />
           <span className="text-xs font-bold">Repost</span>
        </div>
        <div className="flex items-center space-x-2 hover:bg-gray-800 px-3 py-2 rounded-lg cursor-pointer transition-colors group">
           <Send size={18} />
           <span className="text-xs font-bold">Send</span>
        </div>
      </div>
    </div>
  );
};
