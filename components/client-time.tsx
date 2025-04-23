"use client"

import { useState, useEffect } from "react"

export default function ClientTime() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    setTime(new Date().toLocaleString())

    const interval = setInterval(() => {
      setTime(new Date().toLocaleString())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!time) return <span>Loading...</span>

  return <span>{time}</span>
}
