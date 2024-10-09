import React from 'react';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Toolbar,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Work as WorkIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Define styled components
const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 60,
  height: 60,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

// Define data structures
interface JobCategory {
  icon: React.ElementType;
  name: string;
}

interface HowItWorksStep {
  title: string;
  description: string;
}

interface Job {
  title: string;
  company: string;
  location: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
}

// Sample data
const jobCategories: JobCategory[] = [
  { icon: WorkIcon, name: 'Technology' },
  { icon: PeopleIcon, name: 'Customer Service' },
  { icon: BusinessIcon, name: 'Finance' },
];

const howItWorks: HowItWorksStep[] = [
  { title: 'Create an account', description: 'Sign up and complete your profile' },
  { title: 'Search jobs', description: 'Browse through thousands of job listings' },
  { title: 'Apply with ease', description: 'Submit your application with just a few clicks' },
];

const latestJobs: Job[] = [
  { title: 'Frontend Developer', company: 'TechCorp', location: 'Remote' },
  { title: 'Marketing Manager', company: 'BrandCo', location: 'New York, NY' },
  { title: 'Data Analyst', company: 'DataInsights', location: 'San Francisco, CA' },
];

const testimonials: Testimonial[] = [
  { name: 'John Doe', role: 'Software Engineer', content: 'I found my dream job through this portal. The process was smooth and efficient!' },
  { name: 'Jane Smith', role: 'Marketing Specialist', content: 'The variety of job listings is impressive. I highly recommend this platform to all job seekers.' },
];

const EnhancedJobPortalLanding: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            JobPortal
          </Typography>
          <Button color="inherit">Log In</Button>
          <Button color="inherit">Sign Up</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Section>
          <Typography variant="h2" align="center" gutterBottom>
            Find Your Dream Job Today
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Thousands of jobs from top companies are waiting for you
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" size="large">
              Get Started
            </Button>
          </Box>
        </Section>

        <Section>
          <Typography variant="h4" align="center" gutterBottom>
            Featured Job Categories
          </Typography>
          <Grid container spacing={4}>
            {jobCategories.map((category) => (
              <Grid item xs={12} sm={4} key={category.name}>
                <Card>
                  <CardContent>
                    <IconWrapper>
                      <category.icon />
                    </IconWrapper>
                    <Typography variant="h6" align="center">
                      {category.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section>
          <Typography variant="h4" align="center" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid item xs={12} sm={4} key={step.title}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h1" color="primary" gutterBottom>
                    {index + 1}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section>
          <Typography variant="h4" align="center" gutterBottom>
            Latest Job Listings
          </Typography>
          {latestJobs.map((job) => (
            <Card key={job.title} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {job.company} - {job.location}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="outlined">View All Jobs</Button>
          </Box>
        </Section>

        <Section>
          <Typography variant="h4" align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} sm={6} key={testimonial.name}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} color="primary" />
                      ))}
                    </Box>
                    <Typography variant="body1" paragraph>
                      "{testimonial.content}"
                    </Typography>
                    <Typography variant="subtitle1">{testimonial.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {testimonial.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section>
          <Typography variant="h4" align="center" gutterBottom>
            Ready to Start Your Job Search?
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Join thousands of job seekers who have found their perfect match
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" size="large">
              Create Your Account
            </Button>
          </Box>
        </Section>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 JobPortal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default EnhancedJobPortalLanding;