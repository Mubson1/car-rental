import React from "react";
import Router from "../../routes/Router";
import Sidebar from "../Sidebar/Sidebar";
import TopNav from "../TopNav/TopNav";
import useToken from "../../axios/useToken";

const Layout = () => {
  const [token, setToken] = useToken();

  if (JSON.parse(token)?.user?.role === "Admin" || "Staff") {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main__layout">
          <TopNav />

          <div className="content">
            <Router />
          </div>
        </div>
      </div>
    );
  } else {
    return <Router />;
  }
};

export default Layout;
