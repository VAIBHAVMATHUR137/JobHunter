import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface loginFormState {
  email: string;
  password: string;
}
const initialCandidateLoginState: loginFormState = {
  email: "",
  password: "",
};
const initialRecruiterLoginState: loginFormState = {
  email: "",
  password: "",
};

const updateField = (
  state: loginFormState,
  action: PayloadAction<{ field: keyof loginFormState; value: string }>
) => {
  const { field, value } = action.payload;
  state[field] = value;
};
const resetField = (
  state: loginFormState,
  action: PayloadAction<{ field: keyof loginFormState; value: string }>
) => {
  const { field } = action.payload;
  state[field] = "";
};
//Seperate slice for candidate to Login
const candidateLoginSlice = createSlice({
  name: "candidateLoginSlice",
  initialState: initialCandidateLoginState,
  reducers: {
    updateCandidateField: updateField,
    resetCandidateField: resetField,
  },
});
//seperate slice for recruiter to Login
const recruiterLoginSlice = createSlice({
  name: "recruiterLoginState",
  initialState: initialRecruiterLoginState,
  reducers: {
    updateRecruiterField: updateField,
    resetRecruiterField: resetField,
  },
});

export const { updateCandidateField, resetCandidateField } =
  candidateLoginSlice.actions;
export const { updateRecruiterField, resetRecruiterField } =
  recruiterLoginSlice.actions;
export const candidateLoginReducer = candidateLoginSlice.reducer;
export const recruiterLoginReducer = recruiterLoginSlice.reducer;
