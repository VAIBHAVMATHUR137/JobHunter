import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/ui/navbar";
import { HomeImage } from "@/components/ui/HomeImage";

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <Navbar />

      <div className="flex flex-col md:flex-row w-full min-h-screen">
        {/* Left half */}
        <div className="flex-1 flex justify-center items-center p-6">
          <Card className="w-full max-w-md bg-white shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800 font-semibold">
                Login to JobHunter
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-4">
              <label className="flex flex-col text-gray-700">
                Username
                <input
                  type="text"
                  className="mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-white text-white"
                  placeholder="Enter your username"
                />
              </label>
              <label className="flex flex-col text-gray-700">
                Password
                <input
                  type="password"
                  className="mt-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-white text-white"
                  placeholder="Enter your password"
                />
              </label>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium mt-2 shadow-sm transition-colors duration-200"
                onClick={() => nav("/CommonAuthentication")}
              >
                Login
              </Button>
              <p className="text-sm text-center text-gray-500 mt-2">
                Don't have an account?{" "}
                <Link
                  className="text-blue-500 hover:underline font-medium"
                  to="/CommonAuthentication"
                >
                  Register
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right half */}
        <div className="flex-1 flex justify-center items-center p-6 ">
          <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-sm border-2 border-black">
            <HomeImage />
          </div>
        </div>
      </div>
    </div>
  );
}
