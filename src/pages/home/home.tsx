import React, { Suspense } from "react";
// import Table from "../../components/table/Table";
import "./home.scss";

function Home() {
  const Table = React.lazy(() => import("../../components/table/Table"));
  return (
    <div className="homepage_container">
      <Suspense fallback={<div>Loading...</div>}>
        <Table />
      </Suspense>
      {/* <Table /> */}
    </div>
  );
}

export default Home;
