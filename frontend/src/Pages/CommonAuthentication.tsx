import { useNavigate } from "react-router-dom";
import { User, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Navbar from "../components/ui/navbar";

export default function CommonAuthentication() {
  const nav = useNavigate();

  const handleRedirect = (userType: string, action: string) => {
    const routes = {
      candidateLogin: "/CandidateLogin",
      candidateSignup: "/CandidatePersonalInformation",
      recruiterLogin: "/RecruiterLogin",
      recruiterSignup: "/RecruiterPersonalInformation",
    };
    const route =
      routes[
        `${userType}${
          action.charAt(0).toUpperCase() + action.slice(1)
        }` as keyof typeof routes
      ];
    nav(route);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className="border-none shadow-lg rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Side - Branding Section */}
              <div className="bg-gray-800 text-white p-12 flex flex-col justify-center">
                <h1 className="text-4xl font-extrabold mb-6 leading-tight">
                  JobHunter
                </h1>
                <p className="text-xl font-light opacity-80 mb-8">
                  Your professional gateway to career opportunities
                </p>
                <div className="border-l-4 border-gray-500 pl-4">
                  <blockquote className="italic text-sm opacity-70">
                    "Connecting talent with opportunity, one click at a time."
                  </blockquote>
                </div>
              </div>

              {/* Right Side - Authentication Options */}
              <CardContent className="p-12 bg-white flex flex-col justify-center">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Choose Your Path
                </CardTitle>
                <p className="text-center text-gray-500 mb-8">
                  Select your role to begin your journey
                </p>

                <div className="space-y-6">
                  {[
                    {
                      type: "candidate",
                      icon: User,
                      description: "Discover and apply to your dream job",
                    },
                    {
                      type: "recruiter",
                      icon: Building2,
                      description: "Find top talent for your team",
                    },
                  ].map((role) => (
                    <div
                      key={role.type}
                      className="group border border-gray-300 rounded-xl p-6 hover:border-gray-500 transition-all duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <role.icon className="w-8 h-8 text-gray-600 mr-4" />
                        <h3 className="text-xl font-semibold text-gray-800">
                          {role.type.charAt(0).toUpperCase() +
                            role.type.slice(1)}
                        </h3>
                      </div>
                      <p className="text-gray-500 mb-4 text-sm">
                        {role.description}
                      </p>
                      <div className="flex space-x-4">
                        {["login", "signup"].map((action) => (
                          <Button
                            key={action}
                            variant={action === "login" ? "default" : "outline"}
                            className="w-full group"
                            onClick={() => handleRedirect(role.type, action)}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                            <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
