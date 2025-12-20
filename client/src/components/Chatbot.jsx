import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    toggleChatbot,
    addMessage,
    setRecommendations,
    updateModelMetrics
} from '../store/chatbotSlice';
import { recommendationEngine } from '../utils/RecommendationEngine';
import { foodGenieChatbotKnowledgeBase } from '../utils/FoodGenieChatbotKnowledgeBase';
import { IoChatbubbleEllipsesSharp, IoClose, IoSend, IoStatsChart } from 'react-icons/io5';
import { FaRobot, FaUser, FaShoppingCart, FaBox, FaUtensils, FaLeaf, FaMagic, FaHeadset } from 'react-icons/fa';
import { MdLocalOffer, MdRecommend } from 'react-icons/md';

const Chatbot = () => {
    const dispatch = useDispatch();
    const { isOpen, messages, recommendations, modelMetrics } = useSelector(state => state.chatbot);
    const user = useSelector(state => state.user);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const messagesEndRef = useRef(null);

    // Enhanced sample product data for recommendations
    const productDatabase = {
        pasta: [
            { id: 1, name: 'Premium Penne Pasta', price: 120, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop', rating: 4.5 },
            { id: 2, name: 'Authentic Pasta Sauce', price: 150, image: 'https://images.unsplash.com/photo-1611171711912-e48dba1c2e59?w=200&h=200&fit=crop', rating: 4.8 },
            { id: 3, name: 'Aged Parmesan Cheese', price: 250, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=200&h=200&fit=crop', rating: 4.7 }
        ],
        breakfast: [
            { id: 4, name: 'Whole Wheat Bread', price: 40, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop', rating: 4.6 },
            { id: 5, name: 'Organic Fresh Milk', price: 60, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop', rating: 4.9 },
            { id: 6, name: 'Farm Fresh Eggs (12pcs)', price: 80, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200&h=200&fit=crop', rating: 4.8 }
        ],
        snacks: [
            { id: 7, name: 'Spicy Potato Chips', price: 30, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop', rating: 4.4 },
            { id: 8, name: 'Choco Chip Cookies', price: 50, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&h=200&fit=crop', rating: 4.7 },
            { id: 9, name: 'Dark Chocolate Bar', price: 45, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200&h=200&fit=crop', rating: 4.9 }
        ],
        vegetables: [
            { id: 10, name: 'Fresh Tomatoes (1kg)', price: 40, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop', rating: 4.5 },
            { id: 11, name: 'Organic Spinach', price: 30, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop', rating: 4.8 },
            { id: 12, name: 'Red Onions (1kg)', price: 35, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop', rating: 4.6 }
        ],
        chicken: [
            { id: 13, name: 'Fresh Chicken Breast (500g)', price: 220, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&h=200&fit=crop', rating: 4.8 },
            { id: 14, name: 'Chicken Curry Cut (500g)', price: 180, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=200&fit=crop', rating: 4.7 }
        ],
        oats: [
            { id: 15, name: 'Rolled Oats (1kg)', price: 190, image: 'https://images.unsplash.com/photo-1517093725432-a9ac702e80c6?w=200&h=200&fit=crop', rating: 4.9 },
            { id: 16, name: 'Instant Oats (500g)', price: 99, image: 'https://images.unsplash.com/photo-1613769049987-b31b641325b1?w=200&h=200&fit=crop', rating: 4.6 }
        ]
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Train model on user interaction
    const trainModel = async (category) => {
        const metrics = await recommendationEngine.train({
            timeOfDay: new Date().getHours(),
            hasCartItems: false,
            lastCategoryIndex: 0,
            targetCategory: category
        });
        dispatch(updateModelMetrics(metrics));
    };

    // Helper to find products by keyword
    const searchProducts = (query) => {
        const allProducts = Object.values(productDatabase).flat();
        const keywords = query.toLowerCase().split(/[\s,]+/);
        return allProducts.filter(p =>
            keywords.some(k => p.name.toLowerCase().includes(k))
        );
    };

    // Enhanced FoodGenie Chatbot Response Logic
    const generateResponse = async (userMessage) => {
        const message = userMessage.toLowerCase();

        // 1. FoodGenie Chatbot Knowledge Base Logic
        const genieResult = foodGenieChatbotKnowledgeBase.processQuery(message);

        // Handle Actions (Grocery Search)
        if (genieResult.action === 'grocery_search') {
            const products = searchProducts(genieResult.query);

            if (products.length > 0) {
                // Train model if we found a category match
                const categoryMap = { 'pasta': 'pasta', 'oats': 'oats', 'chicken': 'chicken', 'vegetable': 'vegetables' };
                const matchedCat = Object.keys(categoryMap).find(cat => genieResult.query.includes(cat));
                if (matchedCat) await trainModel(categoryMap[matchedCat]);

                dispatch(setRecommendations(products));
            } else {
                // Even if no exact match, we don't show empty recommendations, just the text
                dispatch(setRecommendations([]));
            }
            return genieResult.text;
        }

        // If just chatting/support, clear recommendations
        if (!genieResult.action) {
            dispatch(setRecommendations([]));
        }

        return genieResult.text;
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        dispatch(addMessage({
            sender: 'user',
            text: inputMessage
        }));

        const userMsg = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        setTimeout(async () => {
            const response = await generateResponse(userMsg);
            dispatch(addMessage({
                sender: 'bot',
                text: response
            }));
            setIsTyping(false);
        }, 1000);
    };

    const handleQuickAction = (action) => {
        setInputMessage(action);
        setTimeout(() => handleSendMessage(), 100);
    };

    const handleAddToCart = (product) => {
        dispatch(addMessage({
            sender: 'bot',
            text: `✅ Added **${product.name}** to your cart! 🛒`
        }));
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => dispatch(toggleChatbot())}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-slow group"
            >
                <FaHeadset className="text-4xl group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white animate-pulse">
                    {messages.length}
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-2rem)] flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-slideUp font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 text-white p-5 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
                        <FaHeadset className="text-3xl drop-shadow-md" />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-xl tracking-wide">FoodGenie Chatbot</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]"></span>
                            <p className="text-sm font-medium text-white/90">Expert Support & Food</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className={`p-2 rounded-full transition-all duration-200 ${showStats ? 'bg-white/30' : 'hover:bg-white/20'}`}
                        title="Model Statistics"
                    >
                        <IoStatsChart className="text-2xl" />
                    </button>
                    <button
                        onClick={() => dispatch(toggleChatbot())}
                        className="hover:bg-white/20 p-2 rounded-full transition-all duration-200 hover:rotate-90"
                    >
                        <IoClose className="text-3xl" />
                    </button>
                </div>
            </div>

            {/* Model Stats Panel */}
            {showStats && (
                <div className="bg-slate-900 text-white p-4 text-xs font-mono animate-fadeIn border-b border-slate-700">
                    <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        <FaRobot /> Neural Network Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 p-2 rounded">
                            <span className="text-slate-400 block">Accuracy</span>
                            <span className="text-cyan-300 font-bold text-lg">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <span className="text-slate-400 block">Loss</span>
                            <span className="text-rose-300 font-bold text-lg">{modelMetrics.loss}</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <span className="text-slate-400 block">Precision</span>
                            <span className="text-blue-300 font-bold text-lg">{(modelMetrics.precision * 100).toFixed(1)}%</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded">
                            <span className="text-slate-400 block">F1 Score</span>
                            <span className="text-purple-300 font-bold text-lg">{(modelMetrics.f1 * 100).toFixed(1)}%</span>
                        </div>
                    </div>
                    <p className="mt-2 text-slate-500 italic text-[10px]">
                        *Real-time learning from your interactions
                    </p>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-slate-100">
                <button
                    onClick={() => handleQuickAction('Oats recipes')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95"
                >
                    <FaUtensils className="text-blue-500 text-lg" />
                    Oats Ideas
                </button>
                <button
                    onClick={() => handleQuickAction('My order is late')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95"
                >
                    <FaHeadset className="text-rose-500 text-lg" />
                    Support
                </button>
                <button
                    onClick={() => handleQuickAction('How to make pasta')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95"
                >
                    <FaLeaf className="text-orange-500 text-lg" />
                    Cook Pasta
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.sender === 'user'
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                            : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                            }`}>
                            {msg.sender === 'user' ? (
                                <FaUser className="text-white text-lg" />
                            ) : (
                                <FaHeadset className="text-white text-lg" />
                            )}
                        </div>
                        <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl shadow-sm ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                            <p className="text-[15px] leading-relaxed font-medium whitespace-pre-line">
                                {msg.text.split('**').map((chunk, i) =>
                                    i % 2 === 1 ? <strong key={i} className={msg.sender === 'user' ? 'text-white' : 'text-blue-700'}>{chunk}</strong> : chunk
                                )}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Product Recommendations */}
                {recommendations.length > 0 && (
                    <div className="space-y-3 pl-12 animate-slideUpFade">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended for you</p>
                        {recommendations.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl p-3 flex items-center gap-4 hover:shadow-lg transition-all border border-slate-100 group">
                                <div className="relative overflow-hidden rounded-lg w-20 h-20">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-base truncate">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-emerald-600 font-extrabold text-lg">₹{product.price}</p>
                                        <span className="text-xs font-medium text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">★ {product.rating}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95"
                                >
                                    <FaShoppingCart className="text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex gap-3 animate-fadeIn">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                            <FaHeadset className="text-white text-lg" />
                        </div>
                        <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3 items-center bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-inner">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask FoodGenie Chatbot..."
                        className="flex-1 px-4 py-2.5 bg-transparent focus:outline-none text-slate-700 font-medium placeholder:text-slate-400 text-base"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-400 text-white p-3.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95"
                    >
                        <IoSend className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-slideUpFade { animation: slideUpFade 0.4s ease-out forwards; }
                .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Chatbot;
