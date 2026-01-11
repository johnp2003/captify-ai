import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Heart, MessageCircle, Repeat, Share } from 'lucide-react';

interface XMockProps {
  content: string[];
}

export const XMock: React.FC<XMockProps> = ({ content }) => {
  return (
    <div className="bg-black text-white rounded-[2rem] p-6 w-full max-w-md mx-auto border border-gray-800 shadow-2xl">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full mr-3 border border-gray-800"></div>
        <div>
          <p className="font-bold text-base leading-tight">Your Name</p>
          <p className="text-gray-500 text-sm">@yourhandle</p>
        </div>
        <div className="ml-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>
      {content.map((post, index) => (
        <div key={index} className="mb-6 last:mb-0 border-b border-gray-800 last:border-0 pb-6 last:pb-0">
          <p className="text-[15px] leading-relaxed mb-4">{post}</p>
          <div className="flex justify-between text-gray-500 max-w-[300px]">
            <div className="flex items-center space-x-2 hover:text-sky-400 cursor-pointer transition-colors group">
               <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs">24</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-emerald-400 cursor-pointer transition-colors group">
               <Repeat size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs">12</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-pink-400 cursor-pointer transition-colors group">
               <Heart size={18} className="group-hover:scale-110 transition-transform" />
               <span className="text-xs">86</span>
            </div>
            <div className="flex items-center hover:text-sky-400 cursor-pointer transition-colors group">
               <Share size={18} className="group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
