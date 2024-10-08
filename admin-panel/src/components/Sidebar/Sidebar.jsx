import React, { useState } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import navLinks from "../../assets/dummy-data/navLinks";
import "./sidebar.css";
import useToken from "../../axios/useToken";

const Sidebar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useToken();

  let value = navLinks;
  if (JSON.parse(token)?.user?.role === "Staff") {
    value = navLinks?.filter((nav) => nav.display !== "Users");
  }

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <h2>
          <span>
            <i class="ri-taxi-line"></i>
          </span>{" "}
          Car Rental
        </h2>
      </div>

      <div className="sidebar__content">
        <div className="menu">
          <ul className="nav__list">
            {value?.map((item, index) => (
              <li className="nav__item" key={index}>
                <NavLink
                  to={item.path}
                  className={(navClass) =>
                    navClass.isActive ? "nav__active nav__link" : "nav__link"
                  }>
                  <i className={item.icon}></i>

                  {item.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar__bottom">
          <span
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}>
            <i class="ri-logout-circle-r-line"></i> Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
