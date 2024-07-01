import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useDocumentTitle from "../utils/useDocumentTitle";
import Cookies from "universal-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faFilePrescription,
  faHospitalUser,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [total, setTotal] = useState({});

  const getData = async () => {
    try {
      const response = await axios.get(API_URL + "total", {
        headers: { Authorization: cookies.get("rm-ma-token") },
      });
      if (response.data.success) {
        setTotal(response.data.data);
      } else {
        cookies.remove("rm-ma-token");
        setTimeout(() => {
          window.location.replace("/login");
        }, 500);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useDocumentTitle("Dashboard");
  return (
    <main className="container">
      <div className="d-flex align-items-center p-3 mt-3 mb-0 text-white bg-primary rounded shadow-sm">
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

      <div className="p-3 bg-body rounded shadow-sm">
        <h6 className="pb-2 mb-2 px-4">
          <Row>
            <Col md={{ span: 8, offset: 2 }} sm={12}>
              <img src="/logo.png" alt="" className="img-fluid" />
            </Col>
          </Row>
        </h6>
        <Row>
          <Col xl={3} md={6}>
            <Card className="shadow border-left-dark mb-3 card-hover">
              <Card.Body>
                <Row>
                  <Col xs={9}>
                    <h6 className="text-lighter text-dark mb-0">
                      Total Pasien
                    </h6>
                    <h1 className="text-gray-800">
                      <CountUp end={total.totalPasien} />
                    </h1>
                  </Col>
                  <Col xs={3} className="text-gray-300 text-end pt-3">
                    <FontAwesomeIcon icon={faHospitalUser} size="2x" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="shadow border-left-primary mb-3 card-hover">
              <Card.Body>
                <Row>
                  <Col xs={9}>
                    <h6 className="text-lighter text-primary mb-0">
                      Total Kunjungan
                    </h6>
                    <h1 className="text-gray-800">
                      <CountUp end={total.totalKunjungan} />
                    </h1>
                  </Col>
                  <Col xs={3} className="text-gray-300 text-end pt-3">
                    <FontAwesomeIcon icon={faFilePrescription} size="2x" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="shadow border-left-blue mb-3 card-hover">
              <Card.Body>
                <Row>
                  <Col xs={9}>
                    <h6 className="text-lighter text-blue mb-0">
                      Total Garansi
                    </h6>
                    <h1 className="text-gray-800">
                      <CountUp end={total.totalGaransi} />
                    </h1>
                  </Col>
                  <Col xs={3} className="text-gray-300 text-end pt-3">
                    <FontAwesomeIcon icon={faAddressCard} size="2x" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="shadow border-left-info mb-3 card-hover">
              <Card.Body>
                <Row>
                  <Col xs={9}>
                    <h6 className="text-lighter text-info mb-0">Total Optik</h6>
                    <h1 className="text-gray-800">
                      <CountUp end={total.totalOptik} />
                    </h1>
                  </Col>
                  <Col xs={3} className="text-gray-300 text-end pt-3">
                    <FontAwesomeIcon icon={faStore} size="2x" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <h3 className="border-bottom pb-2 my-2 text-center">Bisa Apa Aja?</h3>
        <Row className="">
          <Col
            md={4}
            sm={12}
            xs={12}
            className="mb-2 d-flex align-items-stretch"
          >
            <Card className="shadow p-3 mb-5 bg-body">
              <Card.Body>
                <div className="p-4">
                  <img
                    src="/stok-lensa.jpg"
                    alt=""
                    className="img-fluid img-hover"
                  />
                </div>
                <Card.Title className="text-center text-primary">
                  <h4>Stok Lensa</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-2 text-gray-800">
                  Kamu bisa mengecek stok lensa yang ada di Lab berdasarkan
                  jenisnya atau bisa langsung mencarinya berdasarkan power
                  lensanya
                </p>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Link
                  to="/stok-lensa"
                  className="btn btn-outline-primary w-100 btn-lg btn-hover fs-6"
                >
                  Selengkapnya
                </Link>
              </Card.Footer>
            </Card>
          </Col>
          <Col
            md={4}
            sm={12}
            xs={12}
            className="mb-2 d-flex align-items-stretch"
          >
            <Card className="shadow p-3 mb-5 bg-body">
              <Card.Body>
                <div className="p-4">
                  <img
                    src="/rekam-medis.jpg"
                    alt=""
                    className="img-fluid img-hover"
                  />
                </div>
                <Card.Title className="text-center text-primary">
                  <h4>Rekam Medis</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-2 text-gray-800">
                  Kamu bisa melihat dan mencatat data pasien yang datang ke
                  Optik, baik itu pasien baru atau kunjungan pasien lama. Kamu
                  juga bisa menghubungi pasien melalui WhatsApp
                </p>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Link
                  to="/rekam-medis"
                  className="btn btn-outline-primary w-100 btn-lg btn-hover fs-6"
                >
                  Selengkapnya
                </Link>
              </Card.Footer>
            </Card>
          </Col>
          <Col
            md={4}
            sm={12}
            xs={12}
            className="mb-2 d-flex align-items-stretch"
          >
            <Card className="shadow p-3 mb-5 bg-body">
              <Card.Body>
                <div className="p-4">
                  <img
                    src="/garansi.jpg"
                    alt=""
                    className="img-fluid img-hover"
                  />
                </div>
                <Card.Title className="text-center text-primary">
                  <h4>Garansi</h4>
                </Card.Title>
                <p className="mt-3 mb-4 mx-2 text-gray-800">
                  Kamu bisa melihat semua data kartu garansi pelanggan yang
                  tercatat di semua Optik dan melakukan klaim garansi nya
                </p>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <Link
                  to="/garansi"
                  className="btn btn-outline-primary w-100 btn-lg btn-hover fs-6"
                >
                  Selengkapnya
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </main>
  );
}

export default Dashboard;
