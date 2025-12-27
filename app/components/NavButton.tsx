import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavButtonProps {
    children: React.ReactNode
    className?: string
}

const NavButton = ({children, className}: NavButtonProps) => {
  return (
    <Button variant={"outline"} className={cn("w-40 rounded-none py-8 border-l-2 border-r-0 border-t-0 border-b-0 border-black hover:bg-blue-500 hover:text-white",
        className && className
    )}>
    {children}
  </Button>
  )
}

export default NavButton