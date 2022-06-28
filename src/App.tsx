import { Snackbar } from '@mui/material';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import './App.scss';
import LoginPage from './pages/login/login';
import { getCartItems } from './store/store';
import {
	closeFaild,
	userSignIn,
	userState,
} from './store/userAuth/userAuthSlice';

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
			{/* <button
				onClick={() => {
					dispatch(getCartItems());
				}}
			>
				get Todos
			</button>

			{store.loading && <div>Loading...</div>}
			{JSON.stringify(store)}
			<br />
			<button
				onClick={() => {
					dispatch(
						userSignIn({
							email: 'test@test.co',
							password: 'test123',
						})
					);
				}}
			>
				SignIn
			</button>
			{JSON.stringify(authReducer)}
			<Snackbar
				open={authReducer.faild}
				autoHideDuration={6000}
				onClose={() => {
					dispatch(closeFaild(authReducer));
				}}
				message="Note archived"
				action={'Faild auth'}
			/> */}
			<LoginPage />
		</div>
	);
}
export default App;
