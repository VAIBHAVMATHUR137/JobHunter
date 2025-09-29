import Navbar from "@/components/ui/navbar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const CommonAuthentication = () => {
  const nav=useNavigate()
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
        <header>
          <Navbar />
        </header>

        <main className="flex-1 ">
          <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-balance text-2xl font-semibold md:text-3xl">Choose how you want to continue</h1>
              <p className="mt-2 text-muted-foreground">One account type per flow. You can switch later.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl">I am a Job Seeker</CardTitle>
                  <CardDescription>Find roles, track applications, and get tailored recommendations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">New to the portal?</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <Button className="w-full sm:w-auto bg-blue-900 text-white" aria-label="Register as Candidate"
                onClick={()=>nav('/CandidatePersonalInformation')}
                 >
                    Register as Candidate
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent bg-gray-900 text-white"
                    aria-label="Sign in as Candidate"
                    onClick={()=>nav('/CandidateLogin')}
                  >
                    Log In
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl">I need Employees</CardTitle>
                  <CardDescription>Post jobs, manage applicants, and hire faster.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">New to the portal?</p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <Button className="w-full sm:w-auto bg-blue-900 text-white" aria-label="Register as Recruiter" onClick={()=>nav('/RecruiterPersonalInformation')}>
                    Register as Recruiter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent bg-gray-900 text-white "
                    aria-label="Sign in as Recruiter"
                    onClick={()=>nav('/RecruiterLogin')}
                  >
                    Log In
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default CommonAuthentication
