"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { 
  Sparkles, Send, Trash2, Copy, ThumbsUp, ThumbsDown, 
  Plus, MessageSquare, AlertCircle, RefreshCw, Check 
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  contentAr: string;
  contentEn: string;
  time: string;
  sourceAr?: string;
  sourceEn?: string;
  liked?: boolean;
  disliked?: boolean;
}

interface ChatSession {
  id: string;
  titleAr: string;
  titleEn: string;
  messages: Message[];
}

export default function Advisor() {
  const { language, t, showToast } = useApp();
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "chat-1",
      titleAr: "الاستفسار عن الارتدادات التجارية",
      titleEn: "Query about Commercial Setbacks",
      messages: [
        {
          id: "m-1",
          sender: "bot",
          contentAr: t.advisorPage.welcome,
          contentEn: t.advisorPage.welcome,
          time: "10:00",
        }
      ]
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState("chat-1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession.messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: "msg-user-" + Date.now(),
      sender: "user",
      contentAr: text,
      contentEn: text,
      time: timeNow,
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    const updatedSessions = sessions.map((s) =>
      s.id === activeSessionId ? { ...s, messages: updatedMessages } : s
    );
    setSessions(updatedSessions);
    setInput("");
    setIsTyping(true);

    // Simulate Bot Response
    setTimeout(() => {
      let botResponseAr = "";
      let botResponseEn = "";
      let sourceAr = "";
      let sourceEn = "";

      const query = text.toLowerCase();
      if (query.includes("نشاط") || query.includes("commercial")) {
        botResponseAr = "بالنسبة للاشتراطات الفنية للأنشطة التجارية في المكاتب والمباني التجارية:\n\n1. **متطلبات الارتداد**: يجب توفير ارتداد أمامي لا يقل عن خمس شارع الخدمة (بحد أدنى 6 أمتار للشارع التجاري عرض 30م).\n2. **ارتفاع الأدوار**: يسمح بارتفاع صافي للدور الأرضي لا يتجاوز 4.5 أمتار للمعارض التجارية.\n3. **مواقف السيارات**: يلزم تأمين موقف سيارة واحد لكل 100 م² من المساحة البنائية الإجمالية للمشروع.\n4. **ممرات المشاة**: يجب ألا يقل عرض الرصيف المشاة الأمامي المحاذي للمحلات عن 2.5 متر.\n\n*يرجى ملاحظة أن هذه الاشتراطات استرشادية.";
        botResponseEn = "Regarding the technical regulations for commercial activities in offices/commercial buildings:\n\n1. **Setback Limits**: Front setbacks must be at least 1/5 of the street width (min 6 meters for a 30m wide street).\n2. **Floor Heights**: Max clear height of 4.5m is allowed for ground-floor showrooms.\n3. **Parking Space**: 1 space per 100 sqm of total built-up area is mandatory.\n4. **Pedestrian Walks**: Front pedestrian sidewalks bordering stores must be at least 2.5m wide.\n\n*Please note this response is advisory.";
        sourceAr = "اشتراطات المباني التجارية - وزارة الشؤون البلدية والقروية 1445هـ";
        sourceEn = "Zoning and Construction Guidelines - MOMRAH 2024";
      } else if (query.includes("موقع") || query.includes("جغراف") || query.includes("location") || query.includes("geographic")) {
        botResponseAr = "اشتراطات الموقع الجغرافي والأحياء السكنية المطورة:\n\n1. **الارتداد الجانبي**: حد أدنى 2 متر للمباني السكنية والتجارية الفرعية لفصل المباني وتأمين الحريق.\n2. **نسبة البناء**: نسبة البناء القصوى المسموحة للفيلات السكنية هي 60%، والمباني التجارية 60% للدور الأرضي.\n3. **ممر الارتداد الخلفي**: لا يقل عن 2 متر لضمان التهوية الطبيعية وخدمات الصرف.\n4. **الأسوار**: ارتفاع السور الجانبي لا يتجاوز 3.5 أمتار مقاساً من منسوب الشارع.\n\n*النتائج استرشادية.";
        botResponseEn = "Geographical zoning setbacks and residential district standards:\n\n1. **Side Setbacks**: Minimum of 2 meters is mandatory for residential/commercial wings to achieve proper fire separation.\n2. **Footprint Coverage**: Max building ratio is 60% of the land area for the ground floor.\n3. **Rear Offset Buffer**: Minimum of 2 meters to secure ventilation and plumbing shafts.\n4. **Boundary Walls**: Left/right boundary walls must not exceed 3.5m in height from street levels.\n\n*Advisory simulation values.";
        sourceAr = "كود العمراني المطور لأمانة منطقة الرياض - المادة 5.3";
        sourceEn = "Riyadh Municipal Urban Development Code - Article 5.3";
      } else if (query.includes("كهرب") || query.includes("electricity")) {
        botResponseAr = "اشتراطات وأنظمة الأعمال الكهربائية المعتمدة بكود البناء السعودي (SBC 401):\n\n1. **غرفة المولد/المحول**: يلزم توفير غرفة محول مستقلة في الدور الأرضي للمباني التي تتجاوز أحمالها 500 ك.ف.أ بمخرج مباشر للشارع.\n2. **مسارات التمديدات**: يجب فصل كابلات الجهد المنخفض عن الجهد المتوسط وتأمينها داخل قنوات عازلة للحريق (Conduits).\n3. **نظام التأريض**: يجب ألا تتجاوز مقاومة بئر التأريض (Grounding Pit) 5 أوم بكابل نحاسي سماكة 25 مم².\n4. **أنظمة الطوارئ**: إلزامية إنارة الطوارئ ومخارج الهروب بلوحات تظل مضيئة لمدة 90 دقيقة عند انقطاع التيار.\n\n*النتائج استرشادية.";
        botResponseEn = "Electrical installation requirements under the Saudi Building Code (SBC 401):\n\n1. **Transformer Room**: Required on the ground floor for projects exceeding 500 kVA, with direct ventilation and access to the public street.\n2. **Cable Trays & Conduits**: Low-voltage cable pathways must be segregated from medium-voltage conduits in fire-rated ducts.\n3. **Grounding Grid**: Earthing resistance must not exceed 5 ohms, using a minimum copper conductor of 25 mm².\n4. **Emergency Power**: Evacuation routes must have backup lighting battery packs functioning for at least 90 minutes.\n\n*Advisory simulation values.";
        sourceAr = "كود التمديدات الكهربائية السعودي (SBC 401) - الباب السادس";
        sourceEn = "Saudi Electrical Code (SBC 401) - Section 6";
      } else if (query.includes("ارتفاع") || query.includes("عرض") || query.includes("width") || query.includes("height")) {
        botResponseAr = "اشتراطات الأبعاد والارتفاعات القصوى المعتمدة:\n\n1. **ارتفاع المبنى الكلي**: أقصى ارتفاع مسموح به للمبنى هو 1.5 مرة عرض الشارع المحاذي.\n2. **سترة السطح (Parapet)**: يجب ألا يتجاوز ارتفاع سترة السطح المعمارية 1.8 متر مقاساً من بلاطة السطح.\n3. **عرض ممرات الإخلاء**: الحد الأدنى لعرض ممر الهروب التجاري هو 1.20 متر.\n4. **ارتفاع البوديوم**: حد أقصى 6 أمتار للدور الأرضي والميزانين التجاري.\n\n*النتائج استرشادية.";
        botResponseEn = "Dimensional limits and building height boundaries:\n\n1. **Total Height**: Max height of the building must not exceed 1.5 times the bordering street width.\n2. **Parapets**: Roof boundary parapet walls must not exceed 1.8m in height above the roof slab.\n3. **Evacuation Routes**: Clear width of internal hallways and egress paths must be at least 1.20m.\n4. **Podiums**: Max height of ground/mezzanine commercial podium blocks is 6m.\n\n*Advisory simulation values.";
        sourceAr = "الاشتراطات المعمارية - كود البناء السعودي SBC 201";
        sourceEn = "Saudi Building Code Architectural Standards - SBC 201";
      } else {
        botResponseAr = `شكرًا لاستفسارك حول "${text}".\n\nبناءً على الكود العمراني السعودي، ننصح بمطابقة مخططاتك مع الاشتراطات التالية:\n1. الارتدادات النظامية (الأمامية 6م والجانبية 2م).\n2. تأمين تهوية وإضاءة طبيعية كافية للفراغات السكنية والمكتبية.\n3. التأكد من توفر مخارج طوارئ وممرات إخلاء بعرض صافٍ لا يقل عن 1.20م للمباني التجارية.\n\n*هذه المعلومات استرشادية، ويمكنك رفع مخططك في صفحة المخططات للتدقيق التلقائي الفني وتحديد المخالفات بدقة.`;
        botResponseEn = `Thank you for asking about "${text}".\n\nBased on general Saudi building codes, please ensure:\n1. Correct setbacks (front 6m, sides 2m) are maintained.\n2. Natural ventilation and lighting requirements are satisfied in office and residential zones.\n3. Evacuation pathways have a net width of at least 1.20m for commercial occupancies.\n\n*This data is advisory. You can upload CAD plans in the upload tab for automated violation detection.`;
        sourceAr = "دليل مراجعة المخططات الهندسية - منصة بلدي الاسترشادية";
        sourceEn = "Balady Portal Engineering Review Manual (Advisory)";
      }

      const botMsg: Message = {
        id: "msg-bot-" + Date.now(),
        sender: "bot",
        contentAr: botResponseAr,
        contentEn: botResponseEn,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sourceAr,
        sourceEn,
      };

      const finalMessages = [...updatedMessages, botMsg];
      const finalSessions = sessions.map((s) =>
        s.id === activeSessionId ? { ...s, messages: finalMessages } : s
      );
      
      // Update session title on first message
      if (activeSession.messages.length === 1) {
        const titleAr = text.slice(0, 30) + "...";
        const titleEn = text.slice(0, 30) + "...";
        const updatedWithTitle = finalSessions.map((s) =>
          s.id === activeSessionId ? { ...s, titleAr, titleEn } : s
        );
        setSessions(updatedWithTitle);
      } else {
        setSessions(finalSessions);
      }

      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleNewChat = () => {
    const newId = "chat-" + Date.now();
    const newChat: ChatSession = {
      id: newId,
      titleAr: language === "ar" ? "محادثة جديدة" : "New Chat Session",
      titleEn: language === "ar" ? "محادثة جديدة" : "New Chat Session",
      messages: [
        {
          id: "msg-init-" + Date.now(),
          sender: "bot" as const,
          contentAr: t.advisorPage.welcome,
          contentEn: t.advisorPage.welcome,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]
    };
    setSessions([newChat, ...sessions]);
    setActiveSessionId(newId);
  };

  const handleClearChat = () => {
    const cleared = sessions.map((s) =>
      s.id === activeSessionId
        ? {
            ...s,
            messages: [
              {
                id: "msg-init-" + Date.now(),
                sender: "bot" as const,
                contentAr: t.advisorPage.welcome,
                contentEn: t.advisorPage.welcome,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            ]
          }
        : s
    );
    setSessions(cleared);
    showToast(language === "ar" ? "تم مسح المحادثة" : "Chat cleared", "info");
  };

  const handleCopy = (msg: Message) => {
    const textToCopy = language === "ar" ? msg.contentAr : msg.contentEn;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMsgId(msg.id);
    showToast(t.advisorPage.copied, "success");
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleLike = (msgId: string, like: boolean) => {
    const updatedMessages = activeSession.messages.map((m) => {
      if (m.id === msgId) {
        return like ? { ...m, liked: !m.liked, disliked: false } : { ...m, disliked: !m.disliked, liked: false };
      }
      return m;
    });
    setSessions(
      sessions.map((s) => (s.id === activeSessionId ? { ...s, messages: updatedMessages } : s))
    );
  };

  return (
    <div className="w-full h-[calc(100vh-4rem-2.5rem)] flex select-none relative overflow-hidden">
      
      {/* Sidebar - Chat History */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-400 p-4 justify-between flex-shrink-0 z-10">
        <div className="space-y-6 flex-grow overflow-y-auto">
          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{t.advisorPage.newChat}</span>
          </button>

          {/* History items */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
              {t.advisorPage.history}
            </h4>
            <div className="space-y-1">
              {sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                const titleLabel = language === "ar" ? s.titleAr : s.titleEn;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-right truncate transition-colors ${
                      isActive 
                        ? "bg-compliance-green text-white font-bold" 
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{titleLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Support disclaimer bottom */}
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-400">{t.disclaimer.title}:</p>
          <p className="leading-relaxed">{t.advisorPage.disclaimer}</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-grow flex flex-col justify-between bg-slate-950 text-slate-300 relative h-full">
        
        {/* Chat header */}
        <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-compliance-green" />
              <span>{t.advisorPage.title}</span>
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">{t.advisorPage.subtitle}</p>
          </div>
          
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-700 hover:border-slate-500 hover:text-white rounded-lg text-[10px] font-bold transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.advisorPage.clear}</span>
          </button>
        </div>

        {/* Chat Messages scroll area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
          {activeSession.messages.map((msg) => {
            const isBot = msg.sender === "bot";
            const textContent = language === "ar" ? msg.contentAr : msg.contentEn;
            const sourceLabel = language === "ar" ? msg.sourceAr : msg.sourceEn;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[80%] ${isBot ? "mr-auto text-right" : "ml-auto flex-row-reverse text-left"}`}
              >
                {/* Robot / User Initial */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isBot ? "bg-compliance-green text-white shadow-md" : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}>
                  {isBot ? <Sparkles className="h-4 w-4" /> : (language === "ar" ? "م" : "E")}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                    isBot 
                      ? "bg-slate-900 border-slate-800 text-slate-100" 
                      : "bg-emerald-950/30 border-compliance-green/30 text-slate-200"
                  }`}>
                    {textContent}

                    {/* Source citation */}
                    {isBot && sourceLabel && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5 text-compliance-green flex-shrink-0" />
                        <span>{t.advisorPage.source} <strong>{sourceLabel}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Actions & timestamp under bubble */}
                  <div className={`flex items-center gap-3 text-[10px] text-slate-500 ${isBot ? "justify-start" : "justify-end"}`}>
                    <span className="font-mono">{msg.time}</span>
                    
                    {isBot && (
                      <div className="flex items-center gap-1">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                          title="Copy Answer"
                        >
                          {copiedMsgId === msg.id ? <Check className="h-3 w-3 text-compliance-green" /> : <Copy className="h-3 w-3" />}
                        </button>
                        
                        {/* Likes */}
                        <button
                          onClick={() => handleLike(msg.id, true)}
                          className={`p-1 rounded hover:bg-slate-800 ${msg.liked ? "text-compliance-green" : "text-slate-500"}`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleLike(msg.id, false)}
                          className={`p-1 rounded hover:bg-slate-800 ${msg.disliked ? "text-red-500" : "text-slate-500"}`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="h-8 w-8 rounded-full bg-compliance-green text-white flex items-center justify-center flex-shrink-0 shadow">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex gap-1 items-center">
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Footer container (Quick actions + Input) */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto space-y-4 w-full">
            
            {/* Quick Prompt suggestions */}
            {activeSession.messages.length === 1 && (
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                {t.advisorPage.quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPromptClick(prompt)}
                    className="px-3 py-1.5 rounded-full border border-slate-700 bg-slate-850 text-[10px] font-bold text-slate-300 hover:border-compliance-green hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(input);
                }}
                placeholder={t.advisorPage.inputPlaceholder}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-compliance-green focus:border-compliance-green text-white placeholder-slate-500"
              />
              
              <button
                onClick={() => handleSend(input)}
                className="absolute top-1/2 -translate-y-1/2 left-2 p-2 bg-compliance-green text-white hover:bg-emerald-800 rounded-lg transition-colors shadow"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
