import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";

function KlaimGaransi({ setCrud, getData, dataGaransi }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [klaim, setKlaim] = useState({
    tanggal: dataGaransi.tanggal,
    garansi_id: dataGaransi.garansi_id,
    nama: dataGaransi.nama,
    frame: dataGaransi.frame,
    lensa: dataGaransi.lensa,
    jenis_garansi: "",
    kerusakan: "",
    perbaikan: "",
  });

  const handleChangeKlaim = (e) => {
    setKlaim((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const submitKlaim = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_URL + "garansi_klaim",
        {
          garansi_id: klaim.garansi_id,
          jenis_garansi: klaim.jenis_garansi,
          kerusakan: klaim.kerusakan,
          perbaikan: klaim.perbaikan,
          tanggal: klaim.tanggal,
        },
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );

      getData();
      closeKlaimGaransi();
      Toast.fire({
        icon: "success",
        title: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const closeKlaimGaransi = useCallback(() => {
    const crudState = {
      show: false,
      detail: false,
      klaim: false,
    };
    setCrud((state) => ({ ...crudState, show: true }));
  }, []);
  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="text-start">
          <Button
            variant="default"
            size="sm"
            onClick={() => closeKlaimGaransi()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Kembali
          </Button>
        </div>
        <h5 className="text-center">Klaim Garansi</h5>
        <span className="text-danger" style={{ fontSize: "12px" }}>
          * Wajib Diisi
        </span>
        <table className="table table-sm table-detail">
          <tbody>
            <tr>
              <td className="fw-semibold">Nama</td>
              <td>:</td>
              <td>{klaim.nama}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Frame</td>
              <td>:</td>
              <td>{klaim.frame}</td>
            </tr>
            <tr>
              <td className="fw-semibold">Lensa</td>
              <td>:</td>
              <td>{klaim.lensa}</td>
            </tr>
          </tbody>
        </table>
        <Form autoComplete="off" onSubmit={submitKlaim}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Tanggal<i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              type="date"
              size="sm"
              name="tanggal"
              value={klaim.tanggal}
              onChange={(e) => handleChangeKlaim(e)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Jenis Garansi<i className="text-danger">*</i>
            </Form.Label>
            <Form.Select
              className="border border-primary"
              size="sm"
              name="jenis_garansi"
              value={klaim.jenis_garansi}
              onChange={(e) => handleChangeKlaim(e)}
              required
            >
              <option hidden>- Jenis Garansi -</option>
              <option value="lensa">Lensa</option>
              <option value="frame">Frame</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Kerusakan<i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="kerusakan"
              as="textarea"
              size="sm"
              rows={3}
              value={klaim.kerusakan}
              onChange={(e) => handleChangeKlaim(e)}
              placeholder="Kerusakan"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Perbaikan<i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="perbaikan"
              as="textarea"
              size="sm"
              rows={3}
              value={klaim.perbaikan}
              onChange={(e) => handleChangeKlaim(e)}
              placeholder="Perbaikan"
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="me-1"
              disabled={
                klaim.tanggal.length === 0 ||
                klaim.jenis_garansi.length === 0 ||
                klaim.kerusakan.length === 0 ||
                klaim.perbaikan.length === 0
              }
            >
              <FontAwesomeIcon icon={faSave} className="me-1" />
              Simpan
            </Button>
          </div>
        </Form>
        <div style={{ fontSize: "11px" }}>
          Syarat dan Ketentuan Garansi:
          <ul className="pl-3">
            <li>Garansi berlaku atas pengelupasan lapisan anti refleksi.</li>
            <li>
              Garansi tidak berlaku atas kerusakan yang diakibatkan oleh
              benturan/goresan benda keras, bahan kimia, atau suhu panas.
            </li>
            <li>
              Klaim atas garansi hanya berlaku dengan menunjukan kartu garansi
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
}

export default KlaimGaransi;
