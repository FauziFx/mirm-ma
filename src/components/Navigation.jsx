import React, { useState, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Footer from "./Footer";
import Avatar from "react-avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";

function Navigation({ user }) {
  const cookies = new Cookies();
  const toggleRef = useRef(null);
  const [menu, setMenu] = useState([
    {
      nama: "Dashboard",
      link: "/dashboard",
    },
    {
      nama: "Stok Lensa",
      link: "/stok-lensa",
    },
    {
      nama: "Rekam Medis",
      link: "/rekam-medis",
    },
    {
      nama: "Garansi",
      link: "/garansi",
    },
    {
      nama: "Data Optik",
      link: "/data-optik",
    },
  ]);

  const signOut = () => {
    cookies.remove("rm-ma-token");
    setTimeout(() => {
      window.location.replace("/login");
    }, 500);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
        fixed="top"
      >
        <Container>
          <Navbar.Brand href="/" className="fw-bold">
            Murti Aji
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" ref={toggleRef} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menu.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  type="button"
                  className="nav-link"
                  onClick={() => toggleRef.current.click()}
                >
                  {item.nama}
                </Link>
              ))}
            </Nav>
            <Nav>
              <NavDropdown
                title={
                  <>
                    <Avatar name={user.nama} size={28} round className="me-1" />
                    {user.nama}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href="#">
                  <Avatar name={user.nama} size={28} round className="me-1" />
                  {user.nama}
                </NavDropdown.Item>
                <NavDropdown.Item disabled>{user.username}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="#"
                  className="text-center"
                  onClick={() => signOut()}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="me-1" />
                  Keluar
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="d-block d-sm-none">
        <div className="nav-scroller bg-body shadow-sm">
          <Nav className="me-auto">
            {menu.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                type="button"
                className="nav-link"
              >
                {item.nama}
              </Link>
            ))}
            <Link
              type="button"
              className="nav-link ms-4"
              onClick={() => signOut()}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="me-1" />
              Keluar
            </Link>
          </Nav>
        </div>
      </Container>

      <Outlet />
      <Footer />
    </>
  );
}

export default Navigation;
