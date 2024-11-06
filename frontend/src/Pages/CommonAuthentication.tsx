import Navbar from "../Components/Navbar";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  ThemeProvider,
  createTheme,
  keyframes,
} from "@mui/material";
import { Person, Business, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

//custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#6200EA",
    },
    secondary: {
      main: "#0446c2",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

//gradient animation for background
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

//Animation while button hovers
const buttonHoverAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
`;

export default function CommonAuthentication() {
  const nav = useNavigate();
  const handleRedirect = (userType: string, action: string) => {
    const routes = {
      candidateLogin: "/CandidateLogin",
      candidateSignup: "/CandidateSignup",
      recruiterLogin: "/RecruiterLogin",
      recruiterSignup: "/RecruiterSignup",
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
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB)",
            backgroundSize: "400% 400%",
            animation: `${gradientAnimation} 15s ease infinite`,
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={10}
              sx={{
                p: 5,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography
                component="h1"
                variant="h3"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #6200EA, #00C853)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  mb: 4,
                }}
              >
                Welcome to JobHunter
              </Typography>
              <Typography
                variant="h6"
                align="center"
                sx={{ mb: 6, color: "text.secondary" }}
              >
                Choose your role and get started on your journey
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {[
                  {
                    type: "candidate",
                    icon: <Person sx={{ fontSize: 40 }} />,
                    color: "primary" as const,
                  },
                  {
                    type: "recruiter",
                    icon: <Business sx={{ fontSize: 40 }} />,
                    color: "secondary" as const,
                  },
                ].map((role) => (
                  <Box key={role.type} sx={{ flex: "1 1 40%", minWidth: 250 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Box>
                        {role.icon}
                        <Typography
                          variant="h5"
                          sx={{ mt: 2, mb: 3, fontWeight: 600 }}
                        >
                          {role.type.charAt(0).toUpperCase() +
                            role.type.slice(1)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {["login", "signup"].map((action) => (
                          <Button
                            key={action}
                            variant={
                              action === "login" ? "contained" : "outlined"
                            }
                            color={role.color}
                            endIcon={<ArrowForward />}
                            sx={{
                              py: 1.5,
                              "&:hover": {
                                animation: `${buttonHoverAnimation} 0.3s ease-in-out`,
                              },
                            }}
                            onClick={() => handleRedirect(role.type, action)}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </Button>
                        ))}
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
}
