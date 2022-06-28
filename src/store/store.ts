import {
	AnyAction,
	combineReducers,
	configureStore,
	createAsyncThunk,
	createSlice,
	getDefaultMiddleware,
} from '@reduxjs/toolkit';
import userReducer, { userState } from './userAuth/userAuthSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { Reducer } from 'react';
const customizedMiddleware = getDefaultMiddleware({
	serializableCheck: false,
});
const init = {
	loading: false,
	data: {},
	error: '',
};
const getCartItems = createAsyncThunk('cart/getCartItems', async () => {
	return fetch('https://jsonplaceholder.typicode.com/todos/1')
		.then((resp) => {
			if (resp.status === 200) {
				return resp.json();
			}
		})
		.catch((err) => {
			console.log('Error', err);
			return err;
		});
});

const todos = createSlice({
	name: 'cart',
	initialState: init,
	extraReducers: (builder) => {
		builder.addCase(getCartItems.fulfilled, (state, action) => {
			console.log('FULFILLED', action.type);
			if (action.payload.message === 'Failed to fetch') {
				console.log('give Error');
				return {
					...state,
					error: action.payload.message,
					loading: false,
				};
			} else {
				console.log('read');
				return { ...state, data: action.payload, loading: false };
			}
		});
		builder.addCase(getCartItems.pending, (state, action) => {
			console.log('PENDING');

			state.loading = true;
		});
		builder.addCase(getCartItems.rejected, (state, action) => {
			console.log('REJECTED');

			console.log('Error ', action.error);
		});
	},
	reducers: {},
});
const persistConfig = {
	key: 'root',
	storage,
};
const RootReducer: any = combineReducers({
	todos: todos.reducer,
	userReducer: userReducer,
});
const persistedReducer = persistReducer(persistConfig, RootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

let persistor = persistStore(store);
export default store;

export { getCartItems, persistor };
