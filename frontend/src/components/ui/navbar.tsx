import { Link } from 'react-router-dom'
import { Briefcase, Menu } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <div className="hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              JobHunter
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/CommonAuthentication">Find Jobs</Link>
            <Link to="/CommonAuthentication">Companies</Link>
            <Link to="/CommonAuthentication">Resources</Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:ring-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 text-sm font-medium">
              <Link to="/CommonAuthentication">Find Jobs</Link>
              <Link to="/CommonAuthentication">Companies</Link>
              <Link to="/CommonAuthentication">Resources</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className="ml-auto h-8 w-full md:w-[120px]"
              asChild
            >
              <Link to="/CommonAuthentication">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}