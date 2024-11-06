import { Button } from "@mui/material";
import { Briefcase, Menu } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
function Navbar() {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <RouterLink to="/" className="mr-6 flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                JobHunter
              </span>
            </RouterLink>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <RouterLink to="/CommonAuthentication">Find Jobs</RouterLink>
              <RouterLink to="/CommonAuthentication">Companies</RouterLink>
              <RouterLink to="/CommonAuthentication">Resources</RouterLink>
            </nav>
          </div>
          <Button
            variant="outlined"
            className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
            startIcon={<Menu className="h-6 w-6" />}
          >
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button
                variant="outlined"
                className="ml-auto h-8 w-full md:w-[120px]"
                component={RouterLink}
                to="/CommonAuthentication"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
