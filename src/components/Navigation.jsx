import React, { useState, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import Footer from "./Footer";

function Navigation() {
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
      nama: "garansi",
      link: "/garansi",
    },
    {
      nama: "Data Optik",
      link: "/data-optik",
    },
  ]);
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
          <Navbar.Brand href="" className="fw-bold">
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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
      <Footer />
    </>
  );
}

export default Navigation;
