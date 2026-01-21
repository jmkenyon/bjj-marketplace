import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavButtonProps {
    children: React.ReactNode
    className?: string
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void ;

}

const NavButton = ({children, className, onClick}: NavButtonProps) => {
  return (
    <Button variant={"outline"} className={cn("sm:w-40 w-22 sm:text-lg text-sm rounded-none py-8 border-l-2 border-r-0 border-t-0 border-b-0 border-black hover:bg-neutral-900 hover:text-white ",
        className && className
    )}
    onClick={onClick}
    >
    {children}
  </Button>
  )
}

export default NavButton