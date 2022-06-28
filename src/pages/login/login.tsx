import { Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import './Login.scss';
import { Field, Form, Formik } from 'formik';
import Logo from '../../assets/images/softline-logo.png';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { userSignIn, userState } from '../../store/userAuth/userAuthSlice';
import { Navigate } from 'react-router-dom';
import Blob from '../../assets/images/blob.svg';
interface LoginTypes {
	email: String;
	password: String;
}
const LoginPage = () => {
	const isLessThanLap = useMediaQuery('(max-width:750px)');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch: any = useDispatch();
	const store = useSelector(
		(state: { todos: { loading: boolean; data: any; error: String } }) => {
			return state.todos;
		}
	);
	const authReducer = useSelector((state: { userReducer: userState }) => {
		return state.userReducer;
	});
	console.log('userAuth', store);
	if (authReducer.auth) {
		return <Navigate to={'/homepage'} replace={true} />;
	}
	return (
		<div className="login_page_contanier">
			<div className="left_side">
				<div className="header_title">
					<img src={Logo} alt="softline-logo" className="logo" />
					<h1>Login</h1>
				</div>

				<form
					className="form"
					onSubmit={(e) => {
						e.preventDefault();
						console.log('email', email, 'password', password);

						if (
							email.trim().toLowerCase() &&
							password.trim().toLocaleLowerCase()
						) {
							dispatch(
								userSignIn({
									email: email.trim().toLowerCase(),
									password: password.trim().toLowerCase(),
								})
							);
						}
					}}
				>
					<h3 className="emailText">Email</h3>
					<input
						type="email"
						name="email"
						required
						className="emailField"
						placeholder="Email"
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>

					<h3 className="passwordText">Password</h3>
					<Space direction="vertical">
						<Input.Password
							required
							minLength={5}
							className="passwordField"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							placeholder="Password"
							iconRender={(visible) =>
								visible ? (
									<EyeTwoTone />
								) : (
									<EyeInvisibleOutlined />
								)
							}
						/>
					</Space>
					<button type="submit" className="loginBtn">
						Login
					</button>
				</form>
			</div>
			{!isLessThanLap && (
				<div className="right_side">
					<img src={Blob} alt="Blob" className="blob" />
				</div>
			)}
		</div>
	);
};

export default LoginPage;
