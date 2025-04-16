import { Link } from "react-router-dom";
import { Briefcase, Users, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Dream Job Today
                </h1>
              </div>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-center">
                Connect with top companies and start your career journey now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/RecruiterPersonalInformation">
                    Register as Recruiter
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/CandidatePersonalInformation">Register as Job Seeker</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Briefcase className="h-10 w-10 mb-2" />
                  <CardTitle>Extensive Job Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Access thousands of job opportunities from top companies
                    across various industries.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 mb-2" />
                  <CardTitle>Personalized Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Our AI-powered system matches you with jobs that fit your
                    skills and preferences.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 mb-2" />
                  <CardTitle>Career Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Get insights and resources to help you advance in your
                    career and achieve your goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of job seekers and recruiters who have found
                  their perfect match with us.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link to="/CommonAuthentication">Sign Up Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © 2024 JobSearch Inc. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link to="/" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link to="/" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
