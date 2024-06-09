import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCertificate,
  faLaptopMedical,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Typewriter from "typewriter-effect";
import { Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="container">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
        <div className="lh-1">
          <h1 className="h5 mb-0 text-white lh-1">
            <Typewriter
              options={{
                loop: true,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Rekam Medis Optik Murti Aji")
                  .pauseFor(750)
                  .deleteAll()
                  .typeString("Selamat Datang")
                  .pauseFor(1000)
                  .start();
              }}
            />
          </h1>
        </div>
      </div>

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <h6 className="pb-2 mb-2 p-4">
          <Row>
            <Col md={{ span: 8, offset: 2 }} sm={12}>
              <img src="/logo.png" alt="" className="img-fluid" height="100 " />
            </Col>
          </Row>
        </h6>
        <h3 className="border-bottom pb-2 my-2 text-center">Bisa Apa Aja?</h3>
        <Row className="px-3">
          <Col md={4} sm={12} xs={12} className="mb-2">
            <Card className="shadow p-3 mb-5 bg-body rounded">
              <Card.Body>
                <div className="p-4">
                  <img src="/stok-lensa.jpg" alt="" className="img-fluid" />
                </div>
                <Card.Title
                  className="text-center"
                  style={{ color: "#6f42c1" }}
                >
                  <h4>Stok Lensa</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-3">
                  Kamu bisa mengecek stok lensa yang ada di Lab berdasarkan
                  jenisnya atau bisa langsung mencarinya berdasarkan power
                  lensanya
                </p>
                <Button
                  className="text-white bg-purple"
                  variant="light w-100"
                  size="lg"
                >
                  Selengkapnya
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12} xs={12} className="mb-2">
            <Card
              className="shadow p-3 mb-5 bg-body rounded"
              style={{ border: "solid #6f42c1 1px" }}
            >
              <Card.Body>
                <div className="p-4">
                  <img src="/rekam-medis.jpg" alt="" className="img-fluid" />
                </div>
                <Card.Title
                  className="text-center"
                  style={{ color: "#6f42c1" }}
                >
                  <h4>Rekam Medis</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-3">
                  Kamu bisa melihat dan mencatat data pasien yang datang ke
                  Optik kamu, baik itu pasien baru atau kunjungan pasien lama
                </p>
                <Button
                  className="text-white bg-purple"
                  variant="light w-100"
                  size="lg"
                >
                  Selengkapnya
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={12} xs={12} className="mb-2">
            <Card className="shadow p-3 mb-5 bg-body rounded">
              <Card.Body>
                <div className="p-4">
                  <img src="/garansi.jpg" alt="" className="img-fluid" />
                </div>
                <Card.Title
                  className="text-center"
                  style={{ color: "#6f42c1" }}
                >
                  <h4>Garansi</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-3">
                  Kamu bisa melihat semua data kartu garansi pelanggan yang
                  tercatat di semua Optik kamu dan melakukan klaim garansi nya
                </p>
                <Button
                  className="text-white bg-purple"
                  variant="light w-100"
                  size="lg"
                >
                  Selengkapnya
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}

export default Dashboard;
