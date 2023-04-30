import React, { useEffect, useRef, useState } from "react";

import { Container, Row, Col } from "reactstrap";
import {
  Link,
  NavLink,
  useNavigate,
  useNavigation,
  useRoutes,
} from "react-router-dom";
import useToken from "../../helper/useToken";
import "../../styles/header.css";
import { usePostLogout } from "../../pages/AuthPages/api";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/cars",
    display: "Cars",
  },

  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const [token, setToken] = useToken();
  const [userDetail, setUserDetail] = useState(JSON.parse(token));

  const [openProfile, setOpenProfile] = useState(false);

  const { mutate: logout, isLoading } = usePostLogout();

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header__middle">
        <Container>
          <Row>
            <Col lg="10" md="9" sm="10">
              <div className="logo">
                <h1>
                  <Link to="/home" className=" d-flex align-items-center gap-2">
                    <i class="ri-car-line"></i>
                    <span>Hajur ko Car Rental</span>
                  </Link>
                </h1>
              </div>
            </Col>
            <Col
              lg="2"
              md="3"
              sm="2"
              className=" d-flex align-items-center justify-content-between">
              {/* <button
                className="header__btn"
                onClick={() => navigate("/contact")}>
                <Link>
                  <i class="ri-phone-line"></i> Request a call
                </Link>
              </button> */}
              {!userDetail?.token ? (
                <button
                  className="header__register"
                  onClick={() => navigate("/auth")}>
                  <Link>Register / Login</Link>
                </button>
              ) : (
                <div className="d-flex w-50 justify-content-end">
                  <div
                    style={{
                      backgroundColor: "#f9a826",
                      height: 40,
                      textAlign: "center",
                      width: 40,
                      borderRadius: 20,
                      marginRight: 6,
                      fontSize: 28,
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}>
                    {userDetail?.user?.username?.charAt(0) || "U"}
                  </div>
                  <i
                    style={{ fontSize: 24, cursor: "pointer" }}
                    class={
                      !openProfile
                        ? "ri-arrow-drop-down-line"
                        : "ri-arrow-drop-up-line"
                    }
                    onClick={() => setOpenProfile(!openProfile)}
                  />
                  {openProfile && (
                    <div
                      style={{
                        position: "absolute",
                        top: 70,
                        zIndex: 999,
                        width: 150,
                        backgroundColor: "white",
                      }}
                      className="profile__box">
                      Username: {userDetail?.user?.username} <hr />
                      <div className="d-flex flex-column">
                        <span
                          onClick={() => navigate("my-requests")}
                          style={{ cursor: "pointer", marginBottom: 6 }}>
                          My Rent Requests
                        </span>
                        <span
                          onClick={() => navigate("profile")}
                          style={{ cursor: "pointer" }}>
                          View Profile
                        </span>
                        <span
                          onClick={handleLogout}
                          style={{ cursor: "pointer" }}>
                          Logout
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-end">
            <span className="mobile__menu">
              <i class="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}>
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
