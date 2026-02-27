import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Bot, Loader2, Volume2, VolumeX, Send, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    checkSlotAvailability,
    searchDoctorByName,
    findAlternativeDoctors,
    bookAppointment,
    generateToken,
    getNextAvailableSlot
} from '../firebase/services';

const VoiceAssistant = ({ isOpen, onClose, onBookingSuccess }) => {
    const { user } = useAuth();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    const recognitionRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = `Hello ${user?.name || 'there'}! I'm your HealthLink assistant. How can I help you today? You can ask me to book an appointment, find a doctor, or check heart health.`;
            addMessage('assistant', greeting);
            speak(greeting);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, interimTranscript]);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error("Speech Recognition not supported");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const finalPart = event.results[i][0].transcript;
                    handleUserVoiceInput(finalPart);
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(interim);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === 'not-allowed') setPermissionError(true);
            setIsListening(false);
        };

        recognitionRef.current.onend = () => setIsListening(false);

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const startListening = () => {
        setPermissionError(false);
        try {
            recognitionRef.current.start();
        } catch (e) {
            console.error("Start error:", e);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
    };

    const toggleListening = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const addMessage = (role, text) => {
        setMessages(prev => [...prev, { role, text, timestamp: new Date() }]);
    };

    const handleUserVoiceInput = async (text) => {
        if (!text.trim()) return;
        addMessage('user', text);
        setInterimTranscript('');
        await sendToAI(text);
    };

    const sendToAI = async (text) => {
        setIsTyping(true);
        try {
            // Prepare history for API (Gemini format)
            const chatHistory = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                text: m.text
            }));

            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, history: chatHistory })
            });

            const data = await res.json();
            const replyText = data.reply || "I'm sorry, I couldn't quite understand that. Could you repeat?";

            addMessage('assistant', replyText);
            speak(replyText);

            // Automated Booking Logic
            if (data.action === 'BOOK_APPOINTMENT') {
                await processBooking(data.bookingData);
            }

        } catch (err) {
            console.error("AI ERROR:", err);
            const errorMsg = "I'm having a little trouble connecting to my brain right now. Please try again soon.";
            addMessage('assistant', errorMsg);
            speak(errorMsg);
        } finally {
            setIsTyping(false);
        }
    };

    const processBooking = async (bookingData) => {
        const { doctor, hospital, date, time, specialty } = bookingData || {};

        addMessage('assistant', "Searching for the right slot for you...");

        // 1. Find Doctor
        let drToBook = doctor ? await searchDoctorByName(doctor) : null;

        if (!drToBook && specialty) {
            const alts = await findAlternativeDoctors(specialty, null, date || 'today', time || '10:00 AM');
            drToBook = alts[0];
        }

        if (!drToBook) {
            const followUp = "I couldn't find that specific doctor. Would you like me to look for a specialist instead?";
            addMessage('assistant', followUp);
            speak(followUp);
            return;
        }

        // 2. Check Availability
        const bookingDate = date || new Date().toLocaleDateString();
        const bookingTime = time || '10:00 AM';
        const isAvailable = await checkSlotAvailability(drToBook.id, bookingDate, bookingTime);

        if (!isAvailable) {
            const nextSlot = await getNextAvailableSlot(drToBook.id, bookingDate, bookingTime);
            const busyMsg = `I'm sorry, Dr. ${drToBook.name} is fully booked at ${bookingTime} on ${bookingDate}. He is available next at ${nextSlot}. Shall I book that for you?`;
            addMessage('assistant', busyMsg);
            speak(busyMsg);
            return;
        }

        // 3. Confirm and Book
        try {
            const finalBooking = {
                doctorId: drToBook.id,
                doctorName: drToBook.name,
                hospitalId: drToBook.hospitalId || 'h1',
                hospitalName: drToBook.hospitalName || 'HealthLink Center',
                patientId: user.uid,
                patientName: user.name,
                date: bookingDate,
                time: bookingTime,
                status: 'Accepted'
            };

            await bookAppointment(finalBooking);
            const tokenData = await generateToken(finalBooking.hospitalId, drToBook.id, user.uid);

            const successMsg = `Perfect! Your appointment with Dr. ${drToBook.name} is confirmed for ${bookingDate} at ${bookingTime}. Your token number is ${tokenData.tokenNumber}.`;
            addMessage('assistant', successMsg);
            speak(successMsg);

            setTimeout(() => onBookingSuccess(finalBooking), 4000);
        } catch (e) {
            console.error("Booking failed:", e);
            addMessage('assistant', "I encountered an error while finalizing your booking. Please try again.");
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[3000] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all z-20"
                    >
                        <X size={24} className="text-white" />
                    </button>

                    <div className="w-full max-w-2xl h-[85vh] flex flex-col gap-6 relative">
                        {/* Header State */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <AnimatePresence>
                                    {isListening && (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{
                                                scale: [1, 1.8, 1],
                                                opacity: [0.3, 0.1, 0.3]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
                                        />
                                    )}
                                </AnimatePresence>
                                <div className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 ${isListening ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700'} transition-all duration-500`}>
                                    {isTyping ? (
                                        <Loader2 className="animate-spin text-blue-300" size={48} />
                                    ) : (
                                        <Bot size={48} className={isListening ? 'text-white' : 'text-slate-400'} />
                                    )}
                                </div>
                            </div>

                            <div className="text-center">
                                <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-3">
                                    {isTyping ? "Thinking..." : isListening ? "Listening..." : "HealthLink Assistant"}
                                    {isListening && (
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-3 h-3 bg-red-500 rounded-full"
                                        />
                                    )}
                                </h1>
                            </div>
                        </div>

                        {/* Chat History Container */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide py-4"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-5 rounded-[24px] shadow-sm flex flex-col gap-2 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/10'
                                        }`}>
                                        <div className="flex items-center gap-2 opacity-50">
                                            {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{msg.role}</span>
                                        </div>
                                        <p className="text-[15px] font-bold leading-relaxed">{msg.text}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {interimTranscript && (
                                <div className="flex justify-end opacity-50">
                                    <div className="max-w-[85%] p-4 bg-blue-600/30 rounded-[20px] rounded-tr-none text-white italic text-sm">
                                        {interimTranscript}...
                                    </div>
                                </div>
                            )}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-[20px] rounded-tl-none flex gap-1">
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-slate-400 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls Overlay */}
                        <div className="flex items-center justify-between gap-4 py-8 border-t border-white/5 mt-auto">
                            <div className="flex-1 flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleListening}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all ${isListening ? 'bg-red-600 ring-8 ring-red-600/20' : 'bg-blue-600 ring-8 ring-blue-600/20'
                                        }`}
                                >
                                    {isListening ? (
                                        <MicOff size={40} className="text-white" />
                                    ) : (
                                        <Mic size={40} className="text-white" />
                                    )}
                                </motion.button>
                            </div>

                            {isSpeaking && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={stopSpeaking}
                                    className="absolute right-0 w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-white/10"
                                >
                                    <VolumeX size={24} className="text-orange-400" />
                                </motion.button>
                            )}
                        </div>

                        {permissionError && (
                            <div className="absolute bottom-32 left-0 right-0 text-center">
                                <p className="text-red-400 text-sm font-bold bg-red-400/10 py-2 px-4 rounded-full inline-block">
                                    Mic access denied. Please enable it in browser settings.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceAssistant;
