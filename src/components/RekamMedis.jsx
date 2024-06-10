import { faHospitalUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container, Tab, Row, Col, Nav } from "react-bootstrap";

function RekamMedis() {
  return (
    <Container>
      <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">
        <div className="lh-1">
          <h1 className="h4 mb-0 text-white lh-1">Rekam Medis</h1>
        </div>
      </div>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="pendaftaran-pasien"
      >
        <Container>
          <Nav variant="underline">
            <Nav.Item>
              <Nav.Link eventKey="pendaftaran-pasien">
                <FontAwesomeIcon icon={faUserPlus} /> &nbsp; Pendaftaran Pasien
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="kunjungan-pasien">
                <FontAwesomeIcon icon={faHospitalUser} /> &nbsp;Kunjungan Pasien
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <Tab.Content>
          <Tab.Pane eventKey="pendaftaran-pasien">First tab content</Tab.Pane>
          <Tab.Pane eventKey="kunjungan-pasien">Second tab content</Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default RekamMedis;
