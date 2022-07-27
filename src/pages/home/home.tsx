import React, { Suspense } from "react";
import { useSelector, TypedUseSelectorHook } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

import store, { RootState } from "../../store/store";
// import Table from "../../components/table/Table";
import "./home.scss";

function Home() {
  const userState = useSelector((state: RootState) => state.userReducer);
  const Table = React.lazy(() => import("../../components/table/Table"));
  const navigate = useNavigate();
  if (!userState.auth) {
    return <Navigate to="/" replace={true} />;
  }
  if (userState.auth) {
    return (
      <div className="homepage_container">
        <Suspense fallback={<Loading />}>
          <Table />
        </Suspense>
        {/* <Loading /> */}
      </div>
    );
  }
  return <span></span>;
}

export default Home;
