import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosConfig from "../../Utils/axiosConfig";

const getContracts = createAsyncThunk("contract/getContract", async () => {
  return axiosConfig
    .get("/api/v1/getContract")
    .then((resp) => {
      console.log("resp", resp);
      if (resp.status === 200) {
        return resp.data;
      } else {
        return resp;
      }
    })
    .catch((err) => {
      console.log("err", err);
      return err;
    });
});

const contractSlice = createSlice({
  name: "contractSlice",
  initialState: [],
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getContracts.pending, (state, action) => {
      return { ...state };
    });
    builder.addCase(getContracts.fulfilled, (state, action) => {
      console.log("payload", action.payload);
      if (action.payload != null) {
        return action.payload.contracts;
      } else {
        return state;
      }
    });
  },
});

const contractReducer = contractSlice.reducer;
export default contractReducer;
export { getContracts };
export const {} = contractSlice.actions;
