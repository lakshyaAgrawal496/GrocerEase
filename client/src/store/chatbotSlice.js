import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    messages: [
        {
            id: 1,
            sender: 'bot',
            text: '👋 Hi! I\'m FoodGenie Chatbot, your grocery assistant! How can I help you today?',
            timestamp: new Date().toISOString()
        }
    ],
    recommendations: [],
    modelMetrics: {
        accuracy: 0,
        loss: 0,
        precision: 0,
        f1: 0
    }
}

const chatbotSlice = createSlice({
    name: "chatbot",
    initialState: initialState,
    reducers: {
        toggleChatbot: (state) => {
            state.isOpen = !state.isOpen
        },
        setChatbotOpen: (state, action) => {
            state.isOpen = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push({
                id: Date.now(),
                ...action.payload,
                timestamp: new Date().toISOString()
            })
        },
        setRecommendations: (state, action) => {
            state.recommendations = action.payload
        },
        clearRecommendations: (state) => {
            state.recommendations = []
        },
        updateModelMetrics: (state, action) => {
            state.modelMetrics = action.payload
        }
    }
})

export const {
    toggleChatbot,
    setChatbotOpen,
    addMessage,
    setRecommendations,
    clearRecommendations,
    updateModelMetrics
} = chatbotSlice.actions

export default chatbotSlice.reducer
