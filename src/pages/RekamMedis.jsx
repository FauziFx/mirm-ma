import {
  faHospitalUser,
  faSquarePlus,
  faTableList,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Container, Tab, Nav, Card, Row, Col, Button } from "react-bootstrap";
import DataPasien from "../components/DataPasien";
import TambahPasien from "../components/TambahPasien";
import KunjunganPasien from "../components/KunjunganPasien";
import TambahKunjungan from "../components/TambahKunjungan";
import useDocumentTitle from "../utils/useDocumentTitle";

function RekamMedis({ user }) {
  useDocumentTitle("Rekam Medis");
  const [tambahPasien, setTambahPasien] = useState(false);
  const [tambahKunjungan, setTambahKunjungan] = useState(false);
  return (
    <>
      <Container className="page-container">
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
                <Nav.Link
                  eventKey="pendaftaran-pasien"
                  className="p-1"
                  style={{ fontSize: "12px" }}
                >
                  <FontAwesomeIcon icon={faUserPlus} /> &nbsp; Pendaftaran
                  Pasien
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="kunjungan-pasien"
                  className="p-1"
                  style={{ fontSize: "12px" }}
                >
                  <FontAwesomeIcon icon={faHospitalUser} /> &nbsp;Kunjungan
                  Pasien
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          <Tab.Content>
            <Tab.Pane eventKey="pendaftaran-pasien">
              <Card className="mb-0 mt-2">
                <Card.Header>
                  <Row>
                    <Col md={6} sm={6} xs={6}>
                      <h5 className="m-0">
                        {tambahPasien ? "Tambah" : "Data"} Pasien
                      </h5>
                    </Col>
                    <Col md={6} sm={6} xs={6} className="text-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setTambahPasien(!tambahPasien)}
                      >
                        {tambahPasien ? (
                          <span>
                            <FontAwesomeIcon icon={faTableList} /> Data Pasien
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon icon={faUserPlus} /> Tambah Pasien
                          </span>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
              {tambahPasien ? (
                <TambahPasien onChangeTambahPasien={setTambahPasien} />
              ) : (
                <DataPasien user={user} />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="kunjungan-pasien">
              <Card className="mb-0 mt-2">
                <Card.Header>
                  <Row>
                    <Col md={6} sm={6} xs={6}>
                      <h5 className="m-0">
                        {tambahKunjungan ? "Tambah" : "Data"} Kunjungan
                      </h5>
                    </Col>
                    <Col md={6} sm={6} xs={6} className="text-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setTambahKunjungan(!tambahKunjungan)}
                      >
                        {tambahKunjungan ? (
                          <span>
                            <FontAwesomeIcon icon={faHospitalUser} /> Data
                            Kunjungan
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon icon={faSquarePlus} /> Tambah
                            Kunjungan
                          </span>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
              {tambahKunjungan ? (
                <TambahKunjungan onChangeTambahKunjungan={setTambahKunjungan} />
              ) : (
                <KunjunganPasien user={user} />
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </>
  );
}

export default RekamMedis;
