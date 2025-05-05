"use client"

import { motion } from "framer-motion"
import { MapPin, ShoppingBag } from "lucide-react"

export function PurchaseNotification({ name, location, timeAgo }) {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className="fixed bottom-4 left-4 z-50 max-w-xs bg-gray-900/90 backdrop-blur-md rounded-lg overflow-hidden border border-teal-800/30 shadow-xl"
    >
      <div className="p-3 flex items-center">
        <div className="h-8 w-8 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 mr-3">
          <ShoppingBag className="h-4 w-4" />
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-teal-400 rounded-full mr-2 animate-pulse"></div>
            <p className="text-white text-sm font-medium">{name}</p>
          </div>

          <div className="flex items-center text-gray-400 text-xs mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{location}</span>
          </div>

          <p className="text-teal-400 text-xs font-medium mt-1">
            Comprou o Kit Família Imune • <span className="text-gray-400">Há {timeAgo}</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
