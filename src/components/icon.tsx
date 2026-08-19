import {
  ArrowLeftRight,
  BarChart3,
  ClipboardList,
  Coins,
  Headset,
  LineChart,
  MapPin,
  Phone,
  Scale,
  Sprout,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  exchange: ArrowLeftRight,
  clipboard: ClipboardList,
  scale: Scale,
  chart: BarChart3,
  sprout: Sprout,
  coins: Coins,
  phone: Phone,
  headset: Headset,
  pin: MapPin,
  line: LineChart,
}

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: string
  size?: number
  className?: string
}) {
  const Cmp = icons[name] ?? LineChart
  return <Cmp size={size} strokeWidth={1.7} className={className} aria-hidden="true" />
}
