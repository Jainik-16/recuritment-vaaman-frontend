// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import { Send, User, Bot, Paperclip } from 'lucide-react';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   sources?: { candidate: string }[];
// }

// export default function ResumeChat() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = { role: 'user', content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://127.0.0.1:8002/api/method/resume_ai.api.resume.chat_api.chat_query', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: input }), // Adjust key based on your backend logic
//       });

//       const data = await response.json();

//       if (data.message.success) {
//         setMessages((prev) => [
//           ...prev,
//           { 
//             role: 'assistant', 
//             content: data.message.answer,
//             sources: data.message.sources 
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error("Chat Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       {/* Header */}
//       <header className="p-4 bg-white border-b shadow-sm">
//         <h1 className="text-xl font-semibold text-gray-800">Resume Intelligence AI</h1>
//       </header>

//       {/* Chat Area */}
//       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
//               <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'}`}>
//                 {msg.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} className="text-gray-600" />}
//               </div>
//               <div className={`p-3 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
//                 <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
//                 {/* {msg.sources && (
//                   <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] uppercase font-bold tracking-wider">
//                     Source: {msg.sources.map(s => s.candidate).join(', ')}
//                   </div>
//                 )} */}
//               </div>
//             </div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="bg-white border p-3 rounded-2xl animate-pulse text-gray-400 text-sm">AI is thinking...</div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="p-4 bg-white border-t">
//         <div className="max-w-4xl mx-auto flex gap-2 bg-gray-100 p-2 rounded-xl focus-within:ring-2 ring-blue-400 transition-all">
//           <button className="p-2 text-gray-500 hover:text-blue-600"><Paperclip size={20}/></button>
//           <input
//             className="flex-1 bg-transparent outline-none text-sm px-2 text-gray-700"
//             placeholder="Ask about candidate skills or work history..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//           />
//           <button 
//             onClick={handleSendMessage}
//             disabled={isLoading}
//             className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: { candidate: string }[];
}

export default function ResumeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE: Load messages from LocalStorage on mount ---
  useEffect(() => {
    const savedChat = localStorage.getItem('resume_chat_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // --- PERSISTENCE: Save messages to LocalStorage whenever they change ---
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('resume_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = () => {
    if (confirm("Clear conversation history?")) {
      setMessages([]);
      localStorage.removeItem('resume_chat_history');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    // setMessages((prev) => [...prev, userMessage]);
    const updatedMessages = [...messages, userMessage]; // Include new message

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8002/api/method/resume_ai.api.resume.chat_api.chat_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input, history: updatedMessages }),
      });

      const data = await response.json();

      if (data.message.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message.answer,
            sources: data.message.sources
          },
        ]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="p-4 bg-white border-b flex justify-between items-center px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Resume Intelligence AI</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Active
          </p>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] lg:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>

              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                    : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                  }`}>
                  {/* --- MARKDOWN SUPPORT --- */}
                  <div className="prose prose-sm max-w-none prose-slate">
                     <ReactMarkdown remarkPlugins={[remarkGfm]}> 
                    {msg.content}
                     </ReactMarkdown> 
                  </div>

                  {/* {msg.sources && msg.sources.length > 0 && (
                    <div className={`mt-3 pt-2 border-t text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'border-indigo-400 text-indigo-100' : 'border-slate-100 text-slate-400'}`}>
                      Verified Candidate: {msg.sources.map(s => s.candidate).join(', ')}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-200 p-4 rounded-2xl rounded-tl-none text-slate-500 text-sm">
              Analyzing resumes...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-white border-t">
        <div className="max-w-4xl mx-auto relative group">
          <input
            className="w-full bg-slate-100 border-none outline-none text-slate-700 py-4 pl-6 pr-16 rounded-2xl focus:ring-2 ring-indigo-500 transition-all shadow-inner"
            placeholder="Search candidate skills or history..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-2.5 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-tighter">
          Internal Recruitment AI • Precision Data Engine
        </p>
      </footer>
    </div>
  );
}