"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function AIChat() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages = [...messages, { role: "user" as "user", content: input }]
    setMessages(newMessages)
    setInput("")

    // Here you would typically make an API call to your AI service
    // For now, we'll just simulate a response
    setTimeout(() => {
      setMessages([...newMessages, { role: "ai" as "ai", content: "This is a simulated AI response." }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-4xl font-bold mb-8">AI Chat</h1>
      <div className="flex-1 overflow-y-auto mb-4 bg-white p-4 rounded-lg shadow-md">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

