import React from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import { Card, Col, Container, Nav, Tab } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faHandHolding,
} from "@fortawesome/free-solid-svg-icons";
import DataGaransi from "../components/DataGaransi";

function Garansi() {
  useDocumentTitle("Garansi");
  return (
    <>
      <Container className="page-container">
        <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">
          <div className="lh-1">
            <h1 className="h4 mb-0 text-white lh-1">Garansi</h1>
          </div>
        </div>
        <Tab.Container id="left-tabs-example" defaultActiveKey="data-garansi">
          <Container>
            <Nav variant="underline">
              <Nav.Item>
                <Nav.Link
                  eventKey="data-garansi"
                  className="p-1"
                  style={{ fontSize: "12px" }}
                >
                  <FontAwesomeIcon icon={faCertificate} className="me-1" />
                  Data Garansi
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="data-klaim-garansi"
                  className="p-1"
                  style={{ fontSize: "12px" }}
                >
                  <FontAwesomeIcon icon={faHandHolding} className="me-1" />
                  Data Klaim Garansi
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          <Tab.Content>
            <Tab.Pane eventKey="data-garansi">
              <Card className="mb-0 mt-2">
                <Card.Header>
                  <h5 className="m-0">Data Garansi</h5>
                </Card.Header>
              </Card>
              <DataGaransi />
            </Tab.Pane>
            <Tab.Pane eventKey="data-klaim-garansi">
              <Card className="mb-0 mt-2">
                <Card.Header>
                  <h5 className="m-0">Data Klaim Garansi</h5>
                </Card.Header>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default Garansi;
