import { Button } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

//Custom theme for button
export const theme = createTheme({
  palette: {
    primary: {
      main: "#3a71a8",
    },
  },
});

//Styled button for Login with transparent effect at hover
export const LoginButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3s ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});
//Styled button for Registration with transparent effect at hover
export const RegistrationButton = styled(Button)({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  transition: "background-color 0.3s ease, color 0.3 ease",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#000",
    cursor: "default",
  },
});
