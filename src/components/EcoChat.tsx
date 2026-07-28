import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askEcoChat } from '../services/apiService';
import { Send, Bot, User, Sparkles, MessageSquare, HelpCircle, Loader2 } from 'lucide-react';

export const EcoChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '안녕하세요! 👋 학교 분리수거 도우미 AI "EcoSort"입니다. 치킨 상자 기름종이, 부러진 볼펜, 우유팩 세척법 등 헷갈리는 쓰레기 배출법을 자유롭게 물어보세요!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const aiReplyText = await askEcoChat(text, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    '영수증은 종이 재활용 되나요?',
    '깨진 유리컵 안전 배출법',
    '기름 묻은 치킨 상자 배출 요령',
    '학교 매점 떡볶이 용기는 스티로폼?',
    '우유팩 세척 후 배출 이유'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>AI 분리수거 지식iN 멘토</span>
              <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-black text-[10px] rounded-full uppercase">
                Gemini 3.6
              </span>
            </h2>
            <p className="text-xs text-teal-100">
              환경부 지침 및 학교 현장 가이드 기반 실시간 Q&A
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="bg-white p-3 rounded-xl border border-slate-200">
        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          자주 묻는 분리수거 질문 추천:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              💡 {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-slate-800'
                    : 'bg-emerald-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-sm text-slate-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>EcoSort AI가 분리배출 지침을 확인 중입니다...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="예: 치킨 박스에 묻은 기름종이는 재활용되나요?"
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 text-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">질문하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};
