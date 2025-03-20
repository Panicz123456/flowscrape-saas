"use client"

import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import CountUp from 'react-countup'

export const ReactCountUpWrapper = ({ value }: { value: number }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Loader2 className="animate-spin size-4" />
    )
  }

  return <CountUp duration={0.5} preserveValue end={value} decimal="0" />
}