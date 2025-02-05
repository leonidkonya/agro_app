"use client"

import { useState } from "react"
import { X, Mail, LinkIcon } from "lucide-react"

interface ShareDataModalProps {
  isOpen: boolean
  onClose: () => void
  dataType: string
}

export default function ShareDataModal({ isOpen, onClose, dataType }: ShareDataModalProps) {
  const [shareMethod, setShareMethod] = useState<"email" | "link">("email")
  const [email, setEmail] = useState("")
  const [shareableLink, setShareableLink] = useState("")

  const handleShare = () => {
    if (shareMethod === "email") {
      // Implement email sharing logic here
      console.log(`Sharing ${dataType} data via email to: ${email}`)
      // You would typically make an API call to your backend here
    } else {
      // Generate a shareable link
      const link = `https://yourdomain.com/share/${dataType}/${Date.now()}`
      setShareableLink(link)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black dark:text-white">Share {dataType} Data</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Share via:</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setShareMethod("email")}
              className={`flex items-center px-3 py-2 rounded ${
                shareMethod === "email" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <Mail size={20} className="mr-2" />
              Email
            </button>
            <button
              onClick={() => setShareMethod("link")}
              className={`flex items-center px-3 py-2 rounded ${
                shareMethod === "link" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <LinkIcon size={20} className="mr-2" />
              Link
            </button>
          </div>
        </div>
        {shareMethod === "email" && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recipient's Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        {shareMethod === "link" && shareableLink && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shareable Link:</label>
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        <button
          onClick={handleShare}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  )
}

