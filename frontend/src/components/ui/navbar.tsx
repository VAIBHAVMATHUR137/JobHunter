import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Menu } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [candidateImage, setCandidateImage] = useState<string | null>(null);
  const [recruiterImage, setRecruiterImage] = useState<string | null>(null);

  useEffect(() => {
    setCandidateImage(localStorage.getItem("candidatePhoto"));
    setRecruiterImage(localStorage.getItem("recruiterPhoto"));
  }, []);

  const navLinks = [
    { name: "Find Jobs", to: "/AllJobs" },
    { name: "Companies", to: "/TopRecruiters" },
    { name: "Resources", to: "/ExceptionalCandidates" },
    { name: "Post a job", to: "/JobPosting" },
    {name:"Test", to :"/Test"}
  ];

  const renderAvatar = () => {
    if (candidateImage) {
      return (
        <Avatar>
          <Link to="/CandidateDashboard">
            <AvatarImage src={candidateImage} alt="Candidate Avatar" />
          </Link>
        </Avatar>
      );
    } else if (recruiterImage) {
      return (
        <Avatar>
          <Link to="/RecruiterDashboard">
            <AvatarImage src={recruiterImage} alt="Recruiter Avatar" />
          </Link>
        </Avatar>
      );
    } else {
      return (
        <Button variant="outline" className="ml-auto h-8 w-full md:w-[120px]" asChild>
          <Link to="/CommonAuthentication">Login</Link>
        </Button>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        {/* Desktop Navbar */}
        <div className="hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">JobHunter</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navbar Sheet */}
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
              {navLinks.map((link) => (
                <Link key={link.name} to={link.to}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Right Side: Avatar/Login Button */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {renderAvatar()}
          </div>
        </div>
      </div>
    </header>
  );
}
