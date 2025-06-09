import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PhoneImage from "../assets/images/images323.jpg"; // Adjust path if needed

const Login = () => {
  const [phone, setPhone] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Phone submitted: ${phone}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "rgb(243, 240, 239)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Grid
        container
        spacing={2}
        alignItems="stretch"
        justifyContent="center"
        sx={{ maxWidth: 1200 }}
      >
        {/* Left Side - Image */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Box
            component="img"
            src={PhoneImage}
            alt="Phone Illustration"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Right Side - Form Card */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{ color: "royalblue", mb: 2, textAlign: "center" }}
            >
              Move your phone in the correct orientation to enter your phone number.
            </Typography>

            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", maxWidth: 350 }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "royalblue", mb: 1 }}
              >
                Your phone number
              </Typography>
              <TextField
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "rgb(17, 37, 166)",
                  ":hover": { backgroundColor: "rgb(67, 14, 147)" },
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
