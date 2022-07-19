import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import "./Login.scss";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userSignIn, userState } from "../../store/userAuth/userAuthSlice";
import { Navigate, useNavigate } from "react-router-dom";
import Blob from "../../assets/images/blob.svg";
interface LoginTypes {
  email: String;
  password: String;
}
interface UserDeatails {
  email: String;
  password: String;
}
const initialUserDeatails: UserDeatails = {
  email: "",
  password: "",
};
const LoginPage = () => {
  const isLessThanLap = useMediaQuery("(max-width:750px)");
  const [userDetails, setUserDeatils] =
    useState<UserDeatails>(initialUserDeatails);

  const dispatch: any = useDispatch();
  const [passwordType, setpasswordType] = useState("password");
  const navigate = useNavigate();
  const store = useSelector(
    (state: { todos: { loading: boolean; data: any; error: String } }) => {
      return state.todos;
    }
  );
  const authReducer = useSelector((state: { userReducer: userState }) => {
    return state.userReducer;
  });

  if (authReducer.auth) {
    return <Navigate to={"/homepage"} replace={true} />;
  }
  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (userDetails.email !== "" || userDetails.password !== "") {
      const data = await dispatch(
        userSignIn({
          email: userDetails.email,
          password: userDetails.password,
        })
      );
      try {
        if (data.payload.ok) {
          navigate("/homepage", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  const changePasswordType = () => {
    setpasswordType(passwordType === "password" ? "text" : "password");
  };
  return (
    <div className="loginPageContainer">
      <div className="leftSide">
        <h2 className="loginTitle">Login</h2>
        <form className="loginForm" method="post" onSubmit={handleSubmit}>
          <label htmlFor="email" className="emailTitle">
            Email
          </label>
          <input
            value={userDetails.email.toString()}
            type="text"
            name="email"
            onChange={(e) => {
              setUserDeatils({ ...userDetails, email: e.target.value });
            }}
            id="email"
            className="emailInput"
          />
          <label htmlFor="password" className="passwordTitle">
            Password
          </label>
          <div className="passwordField">
            <input
              type={passwordType}
              value={userDetails.password.toString()}
              onChange={(e) => {
                setUserDeatils({ ...userDetails, password: e.target.value });
              }}
              name="password"
              id="password"
              className="passwordInput"
            />

            {passwordType === "text" ? (
              <EyeTwoTone
                onClick={changePasswordType}
                className="passwordIcon"
              />
            ) : (
              <EyeInvisibleOutlined
                onClick={changePasswordType}
                className="passwordIcon"
              />
            )}
          </div>

          <button type="submit" className="loginButton">
            Login
          </button>
        </form>
      </div>
      <div className="rightSide">
        <img src={Blob} alt="logo" />
      </div>
    </div>
  );
};

export default LoginPage;
