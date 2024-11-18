import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { candidateRegistartionUpdate } from "../Slice/Slice";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Skeleton,
} from "@mui/material";
import {Grid} from '@mui/material';
import Navbar from "../Components/Navbar";
import axios from "axios";
import { RootState } from "../Slice/Store";

export default function CandidateDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const candidatePhoto = useSelector(
    (state: RootState) => state.candidateRegister.photo
  );

  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/candidate/getIndividualCandidate/6734b367c837d340320d2948"
        );

        if (response.data && response.data.photo) {
          dispatch(
            candidateRegistartionUpdate({
              field: "photo",
              value: response.data.photo,
            })
          );
        }
      } catch (error) {
        setError("Failed to load candidate data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidate();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Grid container spacing={3}>

          </Grid>
        </Paper>
      </Container>
    </>
  );
}
