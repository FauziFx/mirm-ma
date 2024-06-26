import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container, Tab, Nav, Card, Row, Col, Button } from "react-bootstrap";
import useDocumentTitle from "../utils/useDocumentTitle";

import CekStok1 from "../components/CekStok1";
import { faSearchengin } from "@fortawesome/free-brands-svg-icons";

function StokLensa() {
  useDocumentTitle("Stok Lensa");
  const cekState = {
    stok1: false,
    stok2: false,
  };
  const [crud, setCrud] = useState(cekState);

  useEffect(() => {
    setCrud((state) => ({ ...cekState, stok1: true }));
  }, []);
  return (
    <Container className="page-container">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">
        <div className="lh-1">
          <h1 className="h4 mb-0 text-white lh-1">Stok Lensa</h1>
        </div>
      </div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="cek-stok-1">
        <Container>
          <Nav variant="underline">
            <Nav.Item>
              <Nav.Link
                eventKey="cek-stok-1"
                className="p-1"
                style={{ fontSize: "12px" }}
              >
                <FontAwesomeIcon icon={faSearchengin} className="me-1" />
                Cek Stok 1
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="cek-stok-2"
                className="p-1"
                style={{ fontSize: "12px" }}
              >
                <FontAwesomeIcon icon={faSearchengin} className="me-1" />
                Cek Stok 2
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
        <Tab.Content>
          <Tab.Pane eventKey="cek-stok-1">
            <Card className="mb-0 mt-2">
              <Card.Header>
                <Row>
                  <Col md={6} sm={6} xs={6}>
                    <h5 className="m-0">Cek Stok 1</h5>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
            <CekStok1 />
          </Tab.Pane>
          <Tab.Pane eventKey="cek-stok-2">
            <Card className="mb-0 mt-2">
              <Card.Header>
                <Row>
                  <Col md={6} sm={6} xs={6}>
                    <h5 className="m-0">Cek Stok 2</h5>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
            Cek Stok 2
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default StokLensa;
