import { Snackbar } from "@mui/material";
import { AsyncThunkAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import "./App.scss";
import LoginPage from "./pages/Login/Login";

import {
  closeFaild,
  userSignIn,
  userState,
} from "./store/userAuth/userAuthSlice";

function App() {
  const dispatch: any = useDispatch();
  const store = useSelector(
    (state: { todos: { loading: boolean; data: any; error: String } }) => {
      return state.todos;
    }
  );
  const authReducer = useSelector((state: { userReducer: userState }) => {
    return state.userReducer;
  });
  return (
    <div>
      <LoginPage />
    </div>
  );
}
export default App;
