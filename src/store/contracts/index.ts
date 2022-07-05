import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contract, NewContract } from '../../interfaces/Contracts';
import axiosConfig from '../../Utils/axiosConfig';

const getContracts = createAsyncThunk('contract/getContract', async () => {
	return axiosConfig
		.get('/api/v1/getContract')
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

const createContract = createAsyncThunk(
	'contract/createContract',
	async (contract: NewContract) => {
		return axiosConfig
			.post('/api/v1/createContract', { ...contract })
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
	name: 'contractSlice',
	initialState: initialState,
	reducers: {},
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
				const newContract: Contract = action.payload.message;

				state.push(newContract);
			} else {
				return state;
			}
		});
	},
});

const contractReducer = contractSlice.reducer;
export default contractReducer;
export { getContracts, createContract };
export const {} = contractSlice.actions;
