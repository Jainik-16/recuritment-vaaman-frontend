"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Trash2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 1. Updated Interface to include download_url
interface Message {
  role: 'user' | 'assistant';
  content: string;
  format?: 'text' | 'table';
  rows?: Array<Record<string, string>>;
  sources?: { 
    candidate: string;
    download_url?: string; 
  }[];
}

export default function ResumeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set your Frappe Backend URL here
  const FRAPPE_BASE_URL = 'http://127.0.0.1:8002';

  // --- Persistence ---
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
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${FRAPPE_BASE_URL}/api/method/resume_ai.api.resume.chat_api.chat_query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: input,
          history: updatedMessages // Sending history for AI Memory!
        }),
      });

      const data = await response.json();

      if (data.message && data.message.success) {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: data.message.answer,
            format: data.message.format || 'text',
            rows: data.message.rows || [],
            sources: data.message.sources 
          },
        ]);
      } else {
        console.error("API Error:", data.message?.error);
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
      <header className="p-4 bg-white border-b flex justify-between items-center px-6 shadow-sm z-10">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Resume Intel</h1>
          <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Active
          </p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              
              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} min-w-0`}>
                <div className={`p-4 rounded-2xl shadow-sm border overflow-hidden ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                  : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                }`}>
                  
                  {/* Markdown Content */}
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>

                  {/* Table Rendering (If Backend sends a list) */}
                  {msg.format === 'table' && msg.rows && msg.rows.length > 0 && (
                    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white">
                      <div className="max-h-64 overflow-y-auto"> 
                        <table className="w-full text-left text-sm text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 sticky top-0 shadow-sm">
                            <tr>
                              {Object.keys(msg.rows[0]).map((key) => (
                                <th key={key} className="px-4 py-2 font-semibold capitalize">{key.replace('_', ' ')}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {msg.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                {Object.values(row).map((val: any, j) => (
                                  <td key={j} className="px-4 py-2">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Source Citations & Download Buttons */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className={`mt-4 pt-3 border-t flex flex-col gap-3 ${msg.role === 'user' ? 'border-indigo-400' : 'border-slate-100'}`}>
                      <div className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                        Verified Sources: {msg.sources.map(s => s.candidate).join(', ')}
                      </div>

                      {/* Download Buttons Array */}
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, i) => {
                          if (!source.download_url) return null;
                          
                          // Ensure we append Frappe URL if the database returns a relative path like "/private/files/..."
                          const fileUrl = source.download_url.startsWith('http') 
                            ? source.download_url 
                            : `${FRAPPE_BASE_URL}${source.download_url}`;

                          return (
                            <a 
                              key={i} 
                              href={fileUrl}
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors border border-slate-200 shadow-sm"
                              title={`Download ${source.candidate}'s Resume`}
                            >
                              <Download size={14} className="text-slate-500" />
                              {source.candidate}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start gap-3 animate-in fade-in duration-500">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shadow-sm">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-slate-500 text-sm font-medium ml-1">Analyzing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-white border-t z-10">
        <div className="max-w-4xl mx-auto relative group flex items-center shadow-sm rounded-2xl bg-slate-50 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          <input
            className="w-full bg-transparent border-none outline-none text-slate-700 py-4 pl-6 pr-16"
            placeholder="Search candidate skills, experience, or ask for comparisons..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
          Resume Intelligence AI • Powered by Vector Search
        </p>
      </footer>
    </div>
  );
}