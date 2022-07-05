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
import contractReducer from './contracts';

const persistConfig = {
	key: 'root',
	storage,
};
const RootReducer: any = combineReducers({
	contractState: contractReducer,
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

export { persistor };
