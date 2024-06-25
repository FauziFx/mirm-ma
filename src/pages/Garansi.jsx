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
        <DataGaransi />
      </Container>
    </>
  );
}

export default Garansi;
