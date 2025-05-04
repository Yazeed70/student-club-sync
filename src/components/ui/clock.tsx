
import * as React from "react"
import { Clock as ClockIcon } from "lucide-react"

interface ClockProps {
  size?: number
  className?: string
}

const Clock: React.FC<ClockProps> = ({ size = 24, className = "" }) => {
  return <ClockIcon size={size} className={className} />
}

export { Clock }
