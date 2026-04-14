"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, MessageSquare, Menu, Download, Search, Pin, Trash2 } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { API_BASE_URL } from '@/lib/api-config'
import { getFrappeCSRF } from '@/lib/csrf';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    format?: 'text' | 'table';
    rows?: Array<Record<string, string>>;
    sources?: { candidate: string; download_url?: string; }[];
}

interface ChatSession {
    name: string;
    title: string;
    creation: string;
    is_pinned: number;
}

export default function ResumeChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // New States for Sidebar
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const scrollRef = useRef<HTMLDivElement>(null);
    //   const API_BASE_URL = 'http://127.0.0.1:8002';
    // const API_BASE_URL = 'https://ats.octavision.in';

    // const getAuthHeaders = () => ({
    //     'Authorization': `token ${process.env.FRAPPE_API_KEY}:${process.env.FRAPPE_API_SECRET}`,
    // })

    // --- 1. Fetch Sidebar History on Mount ---
    useEffect(() => {
        fetchSessions();
    }, []);

    // Handle Search Input
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSessions(searchTerm);
        }, 300); // Debounce search
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // const fetchSessions = async () => {
    //   try {

    //     // const res = await fetch(`${API_BASE_URL}/api/method/resume_ai.api.resume.chat_api.get_chat_sessions`, {
    //     const res = await fetch(`/api/method/resume_ai.api.resume.chat_api.get_chat_sessions`, {
    //       method: 'GET',
    //       credentials: 'include' // <-- ADDS YOUR LOGIN COOKIE
    //     });
    //     const data = await res.json();
    //     if (data.message && data.message.success) {
    //       setSessions(data.message.sessions);
    //     }
    //   } catch (e) {
    //     console.error("Failed to load sessions", e);
    //   }
    // };

    // Update fetchSessions to include search
    const fetchSessions = async (search?: string) => {
        const url = search
            ? `/api/method/resume_ai.api.resume.chat_api.get_chat_sessions?search_text=${search}`
            : `/api/method/resume_ai.api.resume.chat_api.get_chat_sessions`;

        const res = await fetch(url, { method: 'GET', credentials: 'include' });
        const data = await res.json();
        if (data.message?.success) setSessions(data.message.sessions);
    };

    // --- 2. Load a specific chat from the sidebar ---
    const loadSession = async (sessionId: string) => {
        setCurrentSessionId(sessionId);
        setIsLoading(true);
        try {
            // const res = await fetch(`${API_BASE_URL}/api/method/resume_ai.api.resume.chat_api.get_session_history?session_id=${sessionId}`, {
            //   headers: {
            //     'Content-Type': 'application/json',
            //     ...getAuthHeaders()
            //   }
            // });
            // const res = await fetch(`${API_BASE_URL}/api/method/resume_ai.api.resume.chat_api.get_session_history?session_id=${sessionId}`, {
            const res = await fetch(`/api/method/resume_ai.api.resume.chat_api.get_session_history?session_id=${sessionId}`, {
                method: 'GET',
                credentials: 'include' // <-- ADDS YOUR LOGIN COOKIE
            });
            const data = await res.json();
            if (data.message && data.message.success) {
                setMessages(data.message.messages);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([]);
    };

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    // --- 3. Send Message ---
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const csrfToken = await getFrappeCSRF();
            //   const response = await fetch(`${API_BASE_URL}/api/method/resume_ai.api.resume.chat_api.chat_query`, {                  
              const response = await fetch(`/api/method/resume_ai.api.resume.chat_api.chat_query`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                  "X-Frappe-CSRF-Token": csrfToken
                //   'X-Frappe-CSRF-Token': (window as any).csrf_token
                },
                body: JSON.stringify({
                  question: input,
                  history: messages, // Send existing messages for AI memory
                  session_id: currentSessionId // Pass the ID so backend updates the right row
                }),
              });

            const data = await response.json();

            if (data.message && data.message.success) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: data.message.answer,
                        sources: data.message.sources
                    },
                ]);

                // If this was a new chat, the backend created an ID. Save it!
                if (!currentSessionId && data.message.session_id) {
                    setCurrentSessionId(data.message.session_id);
                    fetchSessions(); // Refresh sidebar to show the new chat
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePin = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation(); // Prevent loading the chat
        const csrfToken = await getFrappeCSRF();
        const res = await fetch(`/api/method/resume_ai.api.resume.chat_api.toggle_pin_session`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
            body: JSON.stringify({ session_id: sessionId })
        });
        if (res.ok) fetchSessions(searchTerm);
    };

    const deleteChat = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (!confirm("Delete this chat?")) return;
        const csrfToken = await getFrappeCSRF();
        const res = await fetch(`/api/method/resume_ai.api.resume.chat_api.delete_session`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', "X-Frappe-CSRF-Token": csrfToken },
            body: JSON.stringify({ session_id: sessionId })
        });
        if (res.ok) {
            if (currentSessionId === sessionId) startNewChat();
            fetchSessions(searchTerm);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

            {/* SIDEBAR (Gemini Style) */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-slate-900 flex flex-col border-r border-slate-800`}>
                {isSidebarOpen && <div className="p-4">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition-colors font-medium text-sm"
                    >
                        <Plus size={18} /> New Chat
                    </button>

                    {/* SEARCH BAR */}
                    <div className="relative group mt-4">
                        <input
                            className="w-full bg-slate-800 text-white text-sm rounded-lg py-2 pl-9 pr-3 outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                    </div>
                </div>}

                {/* <div className="flex-1 overflow-y-auto px-3 space-y-1 mt-2"> */}
                <div className="flex-1 overflow-y-auto px-3 space-y-1 mt-2 custom-scrollbar">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent Chats</p>

                    {/* 1. Show message if search results are empty */}
                    {sessions.length === 0 && searchTerm && (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500 animate-in fade-in duration-300">
                            <Search size={24} className="mb-2 opacity-20" />
                            <p className="text-sm font-medium">No results for "{searchTerm}"</p>
                        </div>
                    )}

                    {/* 2. Show message if there are no chats at all (Empty State) */}
                    {sessions.length === 0 && !searchTerm && (
                        <div className="px-3 py-4 text-sm text-slate-500 italic">
                            No recent conversations.
                        </div>
                    )}

                    {sessions.map((session) => (
                        <div key={session.name} className="group relative">
                            <button
                                onClick={() => loadSession(session.name)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition-colors truncate ${currentSessionId === session.name ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <MessageSquare size={16} className="shrink-0" />

                                {/* Title with padding to make room for the permanent pin */}
                                <span className={`truncate ${session.is_pinned ? 'pr-6' : 'pr-12'}`}>
                                    {session.title}
                                </span>

                                {/* PERMANENT PIN INDICATOR (Visible without hover) */}
                                {session.is_pinned === 1 && (
                                    <Pin
                                        size={14}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 fill-indigo-500 opacity-80"
                                    />
                                )}
                            </button>

                            {/* HOVER ACTIONS (Delete and Toggle Pin) */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 pl-2 shadow-[-10px_0_10px_#0f172a]">
                                <button onClick={(e) => togglePin(e, session.name)} className="p-1 hover:text-indigo-400 text-slate-500">
                                    <Pin size={14} className={session.is_pinned ? "fill-indigo-500 text-indigo-500" : ""} />
                                </button>
                                <button onClick={(e) => deleteChat(e, session.name)} className="p-1 hover:text-red-400 text-slate-500">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* </div> */}

                {/* <div className="flex-1 overflow-y-auto px-3 space-y-1 mt-2 custom-scrollbar">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent Chats</p>
          {sessions.map((session) => (
            <button
              key={session.name}
              onClick={() => loadSession(session.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm rounded-lg transition-colors truncate ${currentSessionId === session.name ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
            >
              <MessageSquare size={16} className="shrink-0" />
              <span className="truncate">{session.title}</span>
            </button>
          ))}
        </div> */}
            </div>

            {/* MAIN CHAT AREA */}
            <div className="flex-1 flex flex-col h-screen relative">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center px-4 shadow-sm shrink-0">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg mr-3">
                        <Menu size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Resume Intel</h1>
                        <p className="text-xs text-emerald-500 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> System Active
                        </p>
                    </div>
                </header>

                {/* Chat Scroll Area (Keep your existing message map logic here) */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Bot size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium">How can I help you evaluate candidates today?</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        /* ... Paste your existing message bubble JSX here ... */
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 max-w-[80%] rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800'}`}>
                                {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown> */}
                                {msg.content}
                                {/* Sources logic... */}
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


                {/* Input Area (Keep your existing input logic here) */}
                <footer className="p-4 bg-white border-t shrink-0">
                    <div className="max-w-4xl mx-auto relative group flex items-center shadow-sm rounded-2xl bg-slate-50 border">
                        <input
                            className="w-full bg-transparent border-none outline-none text-slate-700 py-4 pl-6 pr-16"
                            placeholder="Search candidate skills..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-xl">
                            <Send size={18} />
                        </button>
                    </div>
                </footer>
            </div>
        </div >
    );
}