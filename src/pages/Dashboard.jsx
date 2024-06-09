import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCertificate,
  faLaptopMedical,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Typewriter from "typewriter-effect";
import { Button } from "react-bootstrap";
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
        <h6 className="pb-2 mb-0">
          <img src="/logo.png" alt="" className="img-fluid" />
        </h6>
        <h6 className="border-bottom pb-2 mb-0">Bisa apa aja?</h6>
        <div className="d-flex text-body-secondary pt-3">
          <Button
            variant="light"
            style={{ background: "#007bff" }}
            className="h-50 me-3 text-white"
          >
            <FontAwesomeIcon icon={faBoxesStacked} />
          </Button>
          <p className="pb-3 mb-0 small lh-sm border-bottom w-100">
            <strong className="d-block text-gray-dark">Stok Lensa</strong>
            Kamu bisa mengecek stok lensa yang ada di Lab berdasarkan jenisnya
            atau bisa langsung mencarinya berdasarkan power lensanya
            <Link className="btn btn-link btn-sm" to="/stok-lensa">
              Klik disini...
            </Link>
          </p>
        </div>
        <div className="d-flex text-body-secondary pt-3">
          <Button
            variant="light"
            style={{ background: "#e83e8c" }}
            className="h-50 me-3 text-white"
          >
            <FontAwesomeIcon icon={faLaptopMedical} />
          </Button>
          <p className="pb-3 mb-0 small lh-sm border-bottom w-100">
            <strong className="d-block text-gray-dark">Rekam Medis</strong>
            Kamu bisa melihat dan mencatat data pasien yang datang ke Optik
            kamu, baik itu pasien baru atau kunjungan pasien lama
            <Link className="btn btn-link btn-sm" to="/rekam-medis">
              Klik disini...
            </Link>
          </p>
        </div>
        <div className="d-flex text-body-secondary pt-3">
          <Button
            variant="light"
            style={{ background: "#6f42c1" }}
            className="h-50 me-3 text-white"
          >
            <FontAwesomeIcon icon={faCertificate} />
          </Button>
          <p className="pb-3 mb-0 small lh-sm border-bottom w-100">
            <strong className="d-block text-gray-dark">Garansi</strong>
            Kamu bisa melihat semua data kartu garansi pelanggan yang tercatat
            di Optik kamu dan melakukan klaim garansi nya
            <Link className="btn btn-link btn-sm" to="/rekam-medis">
              Klik disini...
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
