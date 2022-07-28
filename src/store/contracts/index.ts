import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Contract, NewContract } from "../../interfaces/Contracts";
import { NewContract as NC } from "../../interfaces/Contract";
import axiosConfig from "../../Utils/axiosConfig";

const getContracts = createAsyncThunk("contract/getContract", async () => {
  return axiosConfig
    .get("/api/v1/getContract")
    .then((resp) => {
      if (resp.status === 200) {
        return resp.data;
      } else {
        return resp;
      }
    })
    .catch((err) => {
      return err;
    });
});
const editContract = createAsyncThunk(
  "contract/editContract",
  async (updates: {}) => {
    return axiosConfig
      .post("/api/v1/editContract", { ...updates })
      .then((resp) => {
        if (resp.status === 201) {
          return resp.data;
        } else {
          return resp;
        }
      })
      .catch((err) => {
        return err;
      });
  }
);
const createContract = createAsyncThunk(
  "contract/createContract",
  async (contract: NC) => {
    return axiosConfig
      .post("/api/v1/createContract", { ...contract })
      .then((resp) => {
        if (resp.status === 201) {
          return resp.data;
        } else {
          return resp;
        }
      })
      .catch((err) => {
        return err;
      });
  }
);
const initialState: Contract[] = [];
const contractSlice = createSlice({
  name: "contractSlice",
  initialState: initialState,
  reducers: {
    resetContract: () => {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(getContracts.pending, (state, action) => {
      return { ...state };
    });
    builder.addCase(getContracts.fulfilled, (state, action) => {
      if (action.payload != null) {
        return action.payload.contracts;
      } else {
        return state;
      }
    });
    builder.addCase(createContract.fulfilled, (state, action) => {
      if (action.payload.ok) {
        return action.payload.contract;
      } else {
        return state;
      }
    });
  },
});

const contractReducer = contractSlice.reducer;
export default contractReducer;
export { getContracts, createContract, editContract };
export const { resetContract } = contractSlice.actions;
