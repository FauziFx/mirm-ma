import {
  faArrowLeft,
  faArrowRight,
  faFileImage,
  faForward,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  ProgressBar,
  Form,
  Row,
  Col,
  InputGroup,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import Swal from "sweetalert2";

function TambahPasien({ onChangeTambahPasien }) {
  moment.locale("id");
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [barStatus, setBarStatus] = useState(33);
  const [dataOptik, setDataOptik] = useState([]);
  const [step, setStep] = useState(1);
  const [usia, setUsia] = useState("");
  const [token, setToken] = useState("");

  const [dataPribadi, setDataPribadi] = useState({
    nama: "",
    alamat: "",
    tempat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
    id_optik: "",
  });

  const list = [
    { name: "Hipertensi", check: false },
    { name: "Gula Darah", check: false },
    { name: "Kecelakaan", check: false },
    { name: "Operasi Mata", check: false },
    { name: "Katarak", check: false },
    { name: "Lainnya", check: false },
  ];
  const [checkItem, setCheckItem] = useState([
    ...list.map((x, id) => ({ id, ...x })),
  ]);

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      const optik = await axios.get(API_URL + "optik");
      setDataOptik(optik.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStep = (numStep) => {
    if (numStep == 1) {
      setStep(1);
      setBarStatus(33);
    } else if (numStep == 2) {
      setStep(2);
      setBarStatus(67);
    } else {
      setStep(3);
      setBarStatus(100);
    }
  };

  const handleChangeUsia = async (e) => {
    const tahun_lahir = new Date().getFullYear() - e.target.value;
    setUsia(e.target.value);
    setDataPribadi((prevState) => ({
      ...prevState,
      tanggal_lahir: tahun_lahir + "-01-01",
    }));
  };

  const handleChangeDP = (e) => {
    setDataPribadi((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const closeTambahPasien = useCallback(() => {
    onChangeTambahPasien(false);
  }, [onChangeTambahPasien]);

  const simpanDataPribadi = async (e) => {
    e.preventDefault();
    await handleSubmitDataPribadi(e);
    closeTambahPasien();
    Toast.fire({
      icon: "success",
      title: "Data Berhasil Disimpan!",
    });
  };

  const handleSubmitDataPribadi = async (e) => {
    e.preventDefault();
    try {
      const ttl =
        dataPribadi.tempat +
        ", " +
        moment(dataPribadi.tanggal_lahir).format("DD MMMM YYYY");
      const data = {
        nama: dataPribadi.nama,
        alamat: dataPribadi.alamat,
        ttl: ttl,
        jenis_kelamin: dataPribadi.jenis_kelamin,
        pekerjaan: dataPribadi.pekerjaan,
        nohp: dataPribadi.nohp,
        riwayat: dataPribadi.riwayat,
        id_optik: dataPribadi.id_optik,
      };
      const response = await axios.post(API_URL + "pasien", data, {
        headers: {
          Authorization: token,
        },
      });
      if (response.data.success === true) {
        return response.data.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    const tokenDecode = jwtDecode(cookies.get("rm-ma-token"));
    setToken(cookies.get("rm-ma-token"));
    setDataPribadi((prevState) => ({
      ...prevState,
      id_optik: tokenDecode.user.id_optik || "",
    }));
  }, []);

  return (
    <>
      <Card className="shadow">
        <Card.Body className="pt-1">
          <ProgressBar animated now={barStatus} style={{ height: "10px" }} />
          <h5 className="text-center mt-2">
            {step == 1
              ? "Data Pribadi"
              : step == 2
              ? "Ukuran Lama"
              : "Ukuran Baru"}
          </h5>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              {/* Step 1 */}
              {step == 1 && (
                <>
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    * Wajib Diisi
                  </span>
                  <Form
                    id="form-data-pribadi"
                    onSubmit={simpanDataPribadi}
                    autoComplete="off"
                  >
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Nama Optik <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Select
                        className="border border-primary"
                        size="sm"
                        name="id_optik"
                        required
                        value={dataPribadi.id_optik}
                        onChange={(e) => handleChangeDP(e)}
                      >
                        <option hidden>Nama Optik</option>
                        {dataOptik.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.nama_optik}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Nama <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="nama"
                        size="sm"
                        type="text"
                        placeholder="Nama Lengkap"
                        required
                        value={dataPribadi.nama}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Alamat <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="alamat"
                        as="textarea"
                        row={2}
                        placeholder="Alamat"
                        required
                        autoComplete="off"
                        value={dataPribadi.alamat}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Tempat Lahir <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="tempat"
                        size="sm"
                        type="text"
                        placeholder="Tempat Lahir"
                        required
                        value={dataPribadi.tempat}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Usia <i className="text-danger">*</i>
                      </Form.Label>
                      <InputGroup size="sm">
                        <Form.Control
                          className="border border-primary"
                          name="usia"
                          size="sm"
                          type="number"
                          placeholder="Usia"
                          onChange={(e) => handleChangeUsia(e)}
                          value={usia}
                        />
                        <InputGroup.Text className="border border-primary">
                          Tahun
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Tanggal Lahir <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="tanggal_lahir"
                        size="sm"
                        type="date"
                        placeholder="Tanggal Lahir"
                        required
                        value={dataPribadi.tanggal_lahir}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Jenis Kelamin <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Check
                        type="radio"
                        name="jenis_kelamin"
                        label="Laki-laki"
                        id="radio1"
                        value="Laki-laki"
                        checked={dataPribadi.jenis_kelamin === "Laki-laki"}
                        onChange={(e) => handleChangeDP(e)}
                      />
                      <Form.Check
                        type="radio"
                        name="jenis_kelamin"
                        label="Perempuan"
                        id="radio2"
                        value="Perempuan"
                        checked={dataPribadi.jenis_kelamin === "Perempuan"}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Pekerjaan <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="pekerjaan"
                        size="sm"
                        type="text"
                        placeholder="Pekerjaan"
                        required
                        value={dataPribadi.pekerjaan}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        No Hp &nbsp;
                        <i className="text-danger" style={{ fontSize: "12px" }}>
                          Isi &quot;0&quot; jika tidak ada
                        </i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="nohp"
                        size="sm"
                        type="number"
                        placeholder="08xxxx"
                        required
                        autoComplete="off"
                        value={dataPribadi.nohp}
                        onChange={(e) => handleChangeDP(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">Riwayat Penyakit</Form.Label>
                      {checkItem.map((item, i) => {
                        return (
                          <Form.Check
                            key={i}
                            type="checkbox"
                            label={item.name}
                            value={item.name}
                            id={"check" + item.id}
                            onChange={(e) => {
                              const curr = checkItem;
                              curr[item.id].check = !curr[item.id].check;
                              setCheckItem([...curr]);
                              const arr = curr
                                .filter(function (item) {
                                  return item.check == true;
                                })
                                .map((items) => {
                                  return items.name;
                                });
                              setDataPribadi((prevState) => ({
                                ...prevState,
                                riwayat: arr.toString(),
                              }));
                            }}
                            checked={item.check}
                          />
                        );
                      })}
                    </Form.Group>
                    <div className="text-end">
                      <Button
                        type="submit"
                        variant="success"
                        size="sm"
                        className="me-1"
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Simpan
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleStep(2)}
                      >
                        Selanjutnya <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    </div>
                    <div
                      className="text-end text-muted"
                      style={{ fontSize: "12px" }}
                    >
                      <span>
                        * Klik Simpan kalau mau simpan data pasien aja
                      </span>
                    </div>
                  </Form>
                </>
              )}
              {/* Step 2 */}
              {step == 2 && (
                <Form id="form-ukuran-lama">
                  <Form.Group className="mb-2">
                    <Row className="px-2">
                      <Col
                        xs={1}
                        className="fw-bold p-0 pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        OD
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-start"
                          name="rsph"
                          size="sm"
                          type="text"
                          placeholder="SPH"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="rcyl"
                          size="sm"
                          type="text"
                          placeholder="CYL"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="raxis"
                          size="sm"
                          type="text"
                          placeholder="AXIS"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-end  "
                          name="radd"
                          size="sm"
                          type="text"
                          placeholder="ADD"
                        />
                      </Col>
                    </Row>
                    <Row className="px-2">
                      <Col
                        xs={1}
                        className="fw-bold p-0 pt-1"
                        style={{ fontSize: "12px" }}
                      >
                        OS
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-start"
                          name="lsph"
                          size="sm"
                          type="text"
                          placeholder="SPH"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="lcyl"
                          size="sm"
                          type="text"
                          placeholder="CYL"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="laxis"
                          size="sm"
                          type="text"
                          placeholder="AXIS"
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-end  "
                          name="ladd"
                          size="sm"
                          type="text"
                          placeholder="ADD"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">PD</Form.Label>
                    <Row>
                      <Col xs>
                        <Form.Control
                          className="border border-primary"
                          name="pd_jauh"
                          size="sm"
                          type="text"
                          placeholder="PD Jauh"
                          required
                        />
                      </Col>
                      <Col xs>
                        <Form.Control
                          className="border border-primary"
                          name="pd_dekat"
                          size="sm"
                          type="text"
                          placeholder="PD Dekat"
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">Keterangan</Form.Label>
                    <Form.Control
                      as="textarea"
                      className="border border-primary"
                      name="keterangan"
                      row={2}
                      placeholder="Keterangan/Keluhan/Lain-lain..."
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleStep(1)}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Kembali
                      </Button>
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="me-1"
                      >
                        Lewati
                        <FontAwesomeIcon icon={faForward} className="ms-1" />
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleStep(3)}
                      >
                        Selanjutnya <FontAwesomeIcon icon={faArrowRight} />
                      </Button>
                    </div>
                  </div>
                  <div
                    className="text-end text-muted"
                    style={{ fontSize: "12px" }}
                  >
                    <span>* Klik Lewati kalau ngga ada</span>
                  </div>
                </Form>
              )}
              {/* Step 3 */}
              {step == 3 && (
                <>
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    * Wajib Diisi
                  </span>
                  <Form id="form-ukuran-baru">
                    <Form.Group className="mb-2">
                      <Row className="px-2">
                        <Col
                          xs={1}
                          className="fw-bold p-0 pt-1"
                          style={{ fontSize: "12px" }}
                        >
                          OD
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-start"
                            name="rsph"
                            size="sm"
                            type="text"
                            placeholder="SPH"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="rcyl"
                            size="sm"
                            type="text"
                            placeholder="CYL"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="raxis"
                            size="sm"
                            type="text"
                            placeholder="AXIS"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-end  "
                            name="radd"
                            size="sm"
                            type="text"
                            placeholder="ADD"
                          />
                        </Col>
                      </Row>
                      <Row className="px-2">
                        <Col
                          xs={1}
                          className="fw-bold p-0 pt-1"
                          style={{ fontSize: "12px" }}
                        >
                          OS
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-start"
                            name="lsph"
                            size="sm"
                            type="text"
                            placeholder="SPH"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="lcyl"
                            size="sm"
                            type="text"
                            placeholder="CYL"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="laxis"
                            size="sm"
                            type="text"
                            placeholder="AXIS"
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-end  "
                            name="ladd"
                            size="sm"
                            type="text"
                            placeholder="ADD"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        PD <i className="text-danger">*</i>
                      </Form.Label>
                      <Row>
                        <Col xs>
                          <Form.Control
                            className="border border-primary"
                            name="pd_jauh"
                            size="sm"
                            type="text"
                            placeholder="PD Jauh"
                            required
                          />
                        </Col>
                        <Col xs>
                          <Form.Control
                            className="border border-primary"
                            name="pd_dekat"
                            size="sm"
                            type="text"
                            placeholder="PD Dekat"
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Tanggal Periksa <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        type="date"
                        size="sm"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Optik <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Select className="border border-primary" size="sm">
                        <option hidden>Nama optik</option>
                        {dataOptik.map((item, index) => (
                          <option
                            key={index}
                            value={item.id + "-" + item.nama_optik}
                          >
                            {item.nama_optik}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Pemeriksa <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="pemeriksa"
                        size="sm"
                        type="text"
                        placeholder="Pemeriksa"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">Keterangan</Form.Label>
                      <InputGroup size="sm" className="mb-1">
                        <InputGroup.Text className="border border-primary pe-1">
                          Frame
                        </InputGroup.Text>
                        <Form.Control
                          className="border border-primary"
                          name="frame"
                          size="sm"
                          type="text"
                        />
                      </InputGroup>
                      <InputGroup size="sm" className="mb-1">
                        <InputGroup.Text className="border border-primary">
                          Lensa
                        </InputGroup.Text>
                        <Form.Control
                          className="border border-primary"
                          name="lensa"
                          size="sm"
                          type="text"
                        />
                      </InputGroup>
                      <InputGroup size="sm" className="mb-1">
                        <InputGroup.Text className="border border-primary pe-4">
                          Rp
                        </InputGroup.Text>
                        <Form.Control
                          className="border border-primary"
                          name="frame"
                          size="sm"
                          type="text"
                        />
                      </InputGroup>
                      <Form.Control
                        className="border border-primary"
                        name="keterangan"
                        as="textarea"
                        row={2}
                        placeholder="Keterangan lain"
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Lampiran <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        hidden
                      />
                      <Card>
                        <Card.Body
                          className="d-flex justify-content-center"
                          style={{
                            borderStyle: "dashed",
                            borderColor: "grey",
                            cursor: "pointer",
                          }}
                        >
                          <div className="text-center fw-light">
                            <FontAwesomeIcon icon={faFileImage} size="lg" />
                            <br />
                            <div className="text-muted">
                              <i>
                                Unggah File *.jpg, *.jpeg, *.png Max file 3MB
                              </i>
                              <br />
                              <i className="text-secondary">
                                (foto resep dokter/komputer/dll)
                              </i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStep(2)}
                        >
                          <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="me-1"
                          />
                          Kembali
                        </Button>
                      </div>
                      <div>
                        <Button type="button" variant="primary" size="sm">
                          <FontAwesomeIcon icon={faSave} className="me-1" />
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default TambahPasien;
