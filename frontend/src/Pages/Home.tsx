import React from 'react';
import { Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Briefcase, Users, TrendingUp, Menu } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <RouterLink to="/" className="mr-6 flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">JobSearch</span>
            </RouterLink>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <RouterLink to="/jobs">Find Jobs</RouterLink>
              <RouterLink to="/companies">Companies</RouterLink>
              <RouterLink to="/resources">Resources</RouterLink>
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
                to="/signin"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <Typography variant="h1" className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Dream Job Today
                </Typography>
                <Typography variant="body1" className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect with top companies and start your career journey now.
                </Typography>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/register/recruiter"
                >
                  Register as Recruiter
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/register/job-seeker"
                >
                  Register as Job Seeker
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Typography variant="h2" className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Us
            </Typography>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader
                  title="Extensive Job Listings"
                  avatar={<Briefcase className="h-10 w-10" />}
                />
                <CardContent>
                  <Typography>
                    Access thousands of job opportunities from top companies across various industries.
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  title="Personalized Matches"
                  avatar={<Users className="h-10 w-10" />}
                />
                <CardContent>
                  <Typography>
                    Our AI-powered system matches you with jobs that fit your skills and preferences.
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  title="Career Growth"
                  avatar={<TrendingUp className="h-10 w-10" />}
                />
                <CardContent>
                  <Typography>
                    Get insights and resources to help you advance in your career and achieve your goals.
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Typography variant="h2" className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Your Journey?
                </Typography>
                <Typography variant="body1" className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of job seekers and recruiters who have found their perfect match with us.
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/signup"
              >
                Sign Up Now
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <Typography variant="caption" className="text-muted-foreground">
            © 2024 JobSearch Inc. All rights reserved.
          </Typography>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <RouterLink to="#" className="text-xs hover:underline underline-offset-4">
              Terms of Service
            </RouterLink>
            <RouterLink to="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </RouterLink>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;