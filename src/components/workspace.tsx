"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  MessageSquare,
  Search,
  Send,
  User,
  Stethoscope,
  BookOpen,
  Dna,
  Heart,
  MoreVertical,
  Sidebar as SidebarIcon,
  Sparkles,
  ArrowUp,
  Paperclip,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

type Profile = {
  display_name: string | null;
  tier: string | null;
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

async function sendMessage(_messages: Message[]): Promise<string> {
  await new Promise((r) => setTimeout(r, 900));
  return "O Hipócrates ainda tá afiando o bisturi. Sobe o teu primeiro códice quando o upload abrir (Sprint 1.3) e a gente já consulta com página citada.";
}

const SUGGESTED_PROMPTS = [
  {
    title: "Análise de Caso",
    description: "Ajude-me a analisar um estudo de caso clínico de neurologia.",
    icon: <Stethoscope className="w-5 h-5 text-clinic-600" />,
  },
  {
    title: "Fisiologia",
    description: "Explique a cascata de coagulação sanguineo de forma clara.",
    icon: <Dna className="w-5 h-5 text-clinic-600" />,
  },
  {
    title: "Farmacologia",
    description: "Quais as principais interações medicamentosas da varfarina?",
    icon: <BookOpen className="w-5 h-5 text-clinic-600" />,
  },
  {
    title: "Anatomia",
    description: "Revise a anatomia do mediastino superior.",
    icon: <Heart className="w-5 h-5 text-clinic-600" />,
  },
];

export function Workspace({
  email,
  profile,
}: {
  email: string;
  profile: Profile | null;
}) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.display_name?.trim() || email?.split("@")[0] || "estudante";
  const tier = profile?.tier ?? "estagiario";

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isLoading]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substring(7),
      title: "Nova Conversa",
      messages: [],
      createdAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    let sessionId = currentSessionId;
    let updatedSessions = [...sessions];

    if (!sessionId) {
      const newSession: ChatSession = {
        id: Math.random().toString(36).substring(7),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        messages: [],
        createdAt: Date.now(),
      };
      updatedSessions = [newSession, ...sessions];
      sessionId = newSession.id;
      setSessions(updatedSessions);
      setCurrentSessionId(sessionId);
    }

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const sessionIndex = updatedSessions.findIndex((s) => s.id === sessionId);
    updatedSessions[sessionIndex].messages.push(userMessage);

    if (
      updatedSessions[sessionIndex].messages.filter((m) => m.role === "user")
        .length === 1
    ) {
      updatedSessions[sessionIndex].title =
        content.slice(0, 30) + (content.length > 30 ? "..." : "");
    }

    setSessions([...updatedSessions]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponseContent = await sendMessage(
        updatedSessions[sessionIndex].messages
      );

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: aiResponseContent,
        timestamp: Date.now(),
      };

      updatedSessions[sessionIndex].messages.push(assistantMessage);
      setSessions([...updatedSessions]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed md:relative flex flex-col h-full bg-[#f9f9f9] border-r border-slate-100 transition-all duration-300 z-30",
          isSidebarOpen
            ? "w-[260px] translate-x-0"
            : "-translate-x-full md:w-0 md:translate-x-0 md:hidden"
        )}
      >
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1">
            <Image
              src="/assets/codex-logo-pixel.png"
              alt="Avicena"
              width={32}
              height={32}
              priority
              className="rounded-lg"
            />
            <span className="font-bold text-slate-800 tracking-tight">
              Avicena
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-200/50 rounded-lg text-slate-500 transition-colors"
          >
            <SidebarIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 pb-2">
          <button
            onClick={createNewSession}
            className="w-full flex items-center gap-2 p-3 text-sm font-medium text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <Plus className="w-4 h-4" />
            Nova Conversa
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
            Recentes
          </div>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setCurrentSessionId(session.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 text-sm rounded-xl transition-all text-left",
                currentSessionId === session.id
                  ? "bg-clinic-100 text-clinic-900 font-medium"
                  : "text-slate-600 hover:bg-slate-200/50 group"
              )}
            >
              <MessageSquare
                className={cn(
                  "w-4 h-4 shrink-0",
                  currentSessionId === session.id
                    ? "text-clinic-600"
                    : "text-slate-400"
                )}
              />
              <span className="truncate flex-1">{session.title}</span>
              <MoreVertical className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </button>
          ))}

          {sessions.length === 0 && (
            <div className="px-3 py-4 text-sm text-slate-400 italic">
              Nenhuma conversa ainda
            </div>
          )}
        </div>

        <div className="mt-auto p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl text-slate-600">
            <div className="w-8 h-8 rounded-full bg-clinic-50 flex items-center justify-center">
              <User className="w-4 h-4 text-clinic-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{tier}</p>
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-xs text-slate-500 hover:text-slate-800 py-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              >
                <SidebarIcon className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-semibold text-slate-700 md:block hidden">
              {currentSession ? currentSession.title : "Início"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-clinic-50 text-clinic-700 rounded-full text-xs font-medium border border-clinic-100">
              <Sparkles className="w-3.5 h-3.5" />
              Especialista em Saúde
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar flex justify-center"
        >
          <div className="w-full max-w-3xl px-4 py-8">
            {!currentSessionId || currentSession?.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center mt-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 w-16 h-16 rounded-3xl bg-clinic-500 flex items-center justify-center shadow-lg shadow-clinic-200 overflow-hidden"
                >
                  <Image
                    src="/assets/codex-logo-pixel.png"
                    alt="Avicena"
                    width={48}
                    height={48}
                    className="w-10 h-10"
                  />
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Com o que posso ajudar hoje, {displayName}?
                </h1>
                <p className="text-slate-500 mb-12 max-w-md">
                  O Hipócrates é teu assistente para estudos de medicina,
                  enfermagem e todas as áreas da saúde.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSend(prompt.description)}
                      className="flex flex-col items-start p-5 text-left border border-slate-200 hover:border-clinic-500 hover:bg-clinic-50/10 rounded-2xl transition-all group"
                    >
                      <div className="mb-3 p-2 bg-slate-50 rounded-lg group-hover:bg-clinic-100 transition-colors">
                        {prompt.icon}
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">
                        {prompt.title}
                      </h4>
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {prompt.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-20">
                {currentSession!.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4",
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-clinic-500 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                        <Image
                          src="/assets/codex-logo-pixel.png"
                          alt="Hipócrates"
                          width={24}
                          height={24}
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed",
                        message.role === "user"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-white text-slate-800 border border-slate-100 shadow-sm"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className="markdown-body">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-lg bg-clinic-500 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
                      <Image
                        src="/assets/codex-logo-pixel.png"
                        alt="Hipócrates"
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="bg-clinic-50 text-clinic-600 rounded-2xl px-4 py-3 border border-clinic-100 italic text-sm animate-pulse">
                      Auscultando o compêndio...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full bg-gradient-to-t from-white via-white to-transparent pb-8 pt-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto px-4">
            <div className="relative bg-slate-100 rounded-[28px] p-2 pr-3 group focus-within:ring-2 focus-within:ring-clinic-500 transition-all">
              <div className="flex items-end gap-2 px-2">
                <button className="p-2 text-slate-400 hover:text-clinic-600 transition-colors mb-0.5">
                  <Paperclip className="w-5 h-5" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(input);
                    }
                  }}
                  placeholder="Manda tua anamnese... Ex: /resumir capítulo 4 do Guyton"
                  className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none py-3 px-2 text-sm max-h-[200px] custom-scrollbar min-h-[44px]"
                  style={{ height: "auto", maxHeight: "20vh" }}
                  rows={1}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-2.5 rounded-full mb-1 transition-all",
                    input.trim()
                      ? "bg-clinic-600 text-white shadow-md shadow-clinic-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 px-4">
              O Avicena pode cometer erros. Material de estudo, não substitui
              avaliação clínica presencial.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
