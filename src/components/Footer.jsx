import { faMugHot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Col, Row } from "react-bootstrap";

function Footer() {
  return (
    <footer
      className="container footer mt-auto py-3"
      style={{ background: "#f8f9fa" }}
    >
      <Row className="d-flex justify-content-between">
        <Col md={6} className="text-muted">
          Copyright &copy; 2024 Rekam Medis Murti Aji
        </Col>
        <Col md={6} className="text-muted text-end">
          Dibuat dengan <FontAwesomeIcon icon={faMugHot} /> di Rumah dan Bahagia
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
