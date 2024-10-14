import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Slice/Store";
const candidateLogin = (credentials: { email: string; password: string }) => ({
  type: "CANDIDATE_LOGIN",
  payload: credentials,
});

function CandidateLogin() {
  const dispatch = useDispatch();
  const loginData = useSelector((state: RootState) => state.candidateLogin);

  return <div></div>;
}

export default CandidateLogin;
