import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosConfig from "../../Utils/axiosConfig";
export type userState = {
  loading: boolean;
  auth: boolean;
  userEmail: String;
  userId: String;
  accessToken: String;
  faild: boolean;
};
const userInitialState: userState = {
  loading: false,
  auth: false,
  userEmail: "",
  userId: "",
  faild: false,
  accessToken: "",
};
const userSignIn = createAsyncThunk(
  "user/signIn",
  async ({ email, password }: { email: String; password: String }) => {
    return axiosConfig
      .post("/login", {
        email: email,
        password: password,
      })
      .then((resp) => {
        if (resp.status === 201) {
          return resp.data;
        }
      })
      .catch((err) => {
        return err;
      });
  }
);
const userAuthSlice = createSlice({
  name: "userAuthSlice",
  reducers: {
    closeFaild: (state, action) => {
      return { ...state, faild: false };
    },
    unAuth: (state) => {
      return { ...userInitialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSignIn.pending, (state, action: any) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(userSignIn.fulfilled, (state, action) => {
      if (action.payload.ok) {
        return {
          ...state,
          auth: true,
          loading: false,
          accessToken: action.payload.accessToken,
          userEmail: action.payload.userEmail,
          userId: action.payload.userID,
        };
      } else {
        return {
          ...state,
          faild: true,
          loading: false,
        };
      }
    });
  },
  initialState: userInitialState,
});

const userReducer = userAuthSlice.reducer;

export default userReducer;
export { userSignIn };
export const { closeFaild, unAuth } = userAuthSlice.actions;
