import {
  faArrowLeft,
  faArrowRight,
  faFileImage,
  faForward,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  ProgressBar,
  Form,
  Row,
  Col,
  InputGroup,
  Button,
  Image,
} from "react-bootstrap";
import axios from "axios";
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

  const uploadFile = useRef(null);
  const [file, setFile] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [preview, setPreview] = useState("");

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

  const [ukuranLama, setUkuranLama] = useState({
    rsph: "",
    rcyl: "",
    raxis: "",
    radd: "",
    lsph: "",
    lcyl: "",
    laxis: "",
    ladd: "",
    pd_jauh: "",
    pd_dekat: "",
    ukuran_lama: "y",
    keterangan: "",
  });

  const [ukuranBaru, setUkuranBaru] = useState({
    rsph: "",
    rcyl: "",
    raxis: "",
    radd: "",
    lsph: "",
    lcyl: "",
    laxis: "",
    ladd: "",
    pd_jauh: "",
    pd_dekat: "",
    tanggal_periksa: moment().tz("Asia/Jakarta").format("YYYY-MM-DD"),
    pemeriksa: "",
    optik_id: "",
    keterangan: "",
  });

  const [keterangan, setKeterangan] = useState({
    frame: "",
    lensa: "",
    harga: "",
  });

  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

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
    timer: 3000,
    timerProgressBar: true,
  });

  const getData = async () => {
    try {
      const optik = await axios.get(API_URL + "optik");
      setDataOptik(optik.data.data);
    } catch (error) {
      console.log(error.message);
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

  // Handle change usia
  const handleChangeUsia = async (e) => {
    const tahun_lahir = new Date().getFullYear() - e.target.value;
    setUsia(e.target.value);
    setDataPribadi((prevState) => ({
      ...prevState,
      tanggal_lahir: tahun_lahir + "-01-01",
    }));
  };

  // Handle Change Data Pribadi
  const handleChangeDP = (e) => {
    setDataPribadi((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Change Ukuran Lama
  const handleChangeUlPower = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setUkuranLama((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    } else if (value == "-" || value == "+") {
      setUkuranLama((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }
  };

  // Handle Change Ukuran Baru
  const handleChangeUB = (e) => {
    setUkuranBaru((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeUbPower = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setUkuranBaru((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    } else if (value == "-" || value == "+") {
      setUkuranBaru((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    }
  };

  // Load Image
  const loadImage = (e) => {
    const files = e.target.files[0];
    if (
      files.type == "image/png" ||
      files.type == "image/jpeg" ||
      files.type == "image/jpg"
    ) {
      if (files.size > 3145728) {
        Toast.fire({
          icon: "error",
          title: "Waduh kegedean filenya!",
        });
        setOpenPreview(false);
        setFile("");
      } else {
        setFile(files);
        setPreview(URL.createObjectURL(e.target.files[0]));
        setOpenPreview(true);
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Waduh gambarnya harus png, jpg atau jpeg",
      });
      setOpenPreview(false);
      setFile("");
    }
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

  // handle submit data pribadi
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
      console.log(error.message);
    }
  };

  // Handle submit ukuran lama
  const handleSubmitUL = async (pasien_id) => {
    try {
      const od = [
        ukuranLama.rsph,
        ukuranLama.rcyl,
        ukuranLama.raxis,
        ukuranLama.radd,
      ].join("/");
      const os = [
        ukuranLama.lsph,
        ukuranLama.lcyl,
        ukuranLama.laxis,
        ukuranLama.ladd,
      ].join("/");
      const response = await axios.post(
        API_URL + "rekam_lama",
        {
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranLama.pd_jauh),
          pd_dekat: parseInt(ukuranLama.pd_dekat),
          keterangan: ukuranLama.keterangan,
          ukuran_lama: "y",
          pasien_id: pasien_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  // handle submit ALl (Data Pribadi, Ukuran lama*, Ukuran Baru)
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    try {
      // Insert & Get last insert ID pasien
      const pasien_id = await handleSubmitDataPribadi(e);
      // Insert ukuran lama
      if (ukuranLama.rsph.length !== 0) {
        await handleSubmitUL(pasien_id);
      }
      // Insert ukuran baru
      const od = [
        ukuranBaru.rsph,
        ukuranBaru.rcyl,
        ukuranBaru.raxis,
        ukuranBaru.radd,
      ].join("/");
      const os = [
        ukuranBaru.lsph,
        ukuranBaru.lcyl,
        ukuranBaru.laxis,
        ukuranBaru.ladd,
      ].join("/");

      // Append Keterangan
      const ket =
        keterangan.frame +
        "\n" +
        keterangan.lensa +
        "\nRp. " +
        keterangan.harga;

      // FormData
      const formData = new FormData();
      formData.append("image", file);
      formData.append(
        "data",
        JSON.stringify({
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranBaru.pd_jauh),
          pd_dekat: parseInt(ukuranBaru.pd_dekat),
          tanggal_periksa: ukuranBaru.tanggal_periksa,
          pemeriksa: ukuranBaru.pemeriksa,
          keterangan: ket + "\n" + ukuranBaru.keterangan,
          ukuran_lama: "n",
          optik_id: ukuranBaru.optik_id,
          pasien_id: pasien_id,
        })
      );

      const response = await axios.post(API_URL + "rekam", formData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.data.success) {
        closeTambahPasien();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error.message);
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
    setUkuranBaru((prevState) => ({
      ...prevState,
      optik_id: tokenDecode.user.id_optik || "",
    }));
  }, []);

  return (
    <>
      <Card className="shadow">
        <Card.Body className="pt-1">
          <ProgressBar animated now={barStatus} style={{ height: "10px" }} />
          <Row>
            <Col md={{ span: 6, offset: 3 }} className="pt-2">
              {step == 1 && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => closeTambahPasien()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                  Kembali
                </Button>
              )}
              <h5 className="text-center">
                {step == 1
                  ? "Data Pribadi"
                  : step == 2
                  ? "Ukuran Lama"
                  : "Ukuran Baru"}
              </h5>
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
                        disabled={
                          dataPribadi.nama.length === 0 ||
                          dataPribadi.alamat.length === 0 ||
                          dataPribadi.tempat.length === 0 ||
                          dataPribadi.tanggal_lahir.length === 0 ||
                          dataPribadi.jenis_kelamin.length === 0 ||
                          dataPribadi.pekerjaan.length === 0 ||
                          dataPribadi.nohp.length === 0 ||
                          dataPribadi.id_optik.length === 0
                        }
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Simpan
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleStep(2)}
                        disabled={
                          dataPribadi.nama.length === 0 ||
                          dataPribadi.alamat.length === 0 ||
                          dataPribadi.tempat.length === 0 ||
                          dataPribadi.tanggal_lahir.length === 0 ||
                          dataPribadi.jenis_kelamin.length === 0 ||
                          dataPribadi.pekerjaan.length === 0 ||
                          dataPribadi.nohp.length === 0 ||
                          dataPribadi.id_optik.length === 0
                        }
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
                <Form id="form-ukuran-lama" autoComplete="off">
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
                          value={ukuranLama.rsph}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="rcyl"
                          size="sm"
                          type="text"
                          placeholder="CYL"
                          value={ukuranLama.rcyl}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="raxis"
                          size="sm"
                          type="text"
                          placeholder="AXIS"
                          value={ukuranLama.raxis}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-end  "
                          name="radd"
                          size="sm"
                          type="text"
                          placeholder="ADD"
                          value={ukuranLama.radd}
                          onChange={(e) => handleChangeUlPower(e)}
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
                          value={ukuranLama.lsph}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="lcyl"
                          size="sm"
                          type="text"
                          placeholder="CYL"
                          value={ukuranLama.lcyl}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0"
                          name="laxis"
                          size="sm"
                          type="text"
                          placeholder="AXIS"
                          value={ukuranLama.laxis}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs className="p-0">
                        <Form.Control
                          className="border border-primary rounded-0 rounded-end  "
                          name="ladd"
                          size="sm"
                          type="text"
                          placeholder="ADD"
                          value={ukuranLama.ladd}
                          onChange={(e) => handleChangeUlPower(e)}
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
                          value={ukuranLama.pd_jauh}
                          onChange={(e) => handleChangeUlPower(e)}
                        />
                      </Col>
                      <Col xs>
                        <Form.Control
                          className="border border-primary"
                          name="pd_dekat"
                          size="sm"
                          type="text"
                          placeholder="PD Dekat"
                          value={ukuranLama.pd_dekat}
                          onChange={(e) => handleChangeUlPower(e)}
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
                      value={ukuranLama.keterangan}
                      onChange={(e) =>
                        setUkuranLama((prev) => ({
                          ...prev,
                          keterangan: e.target.value,
                        }))
                      }
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
                        onClick={() => {
                          setUkuranLama({
                            rsph: "",
                            rcyl: "",
                            raxis: "",
                            radd: "",
                            lsph: "",
                            lcyl: "",
                            laxis: "",
                            ladd: "",
                            pd_jauh: "",
                            pd_dekat: "",
                            ukuran_lama: "y",
                            keterangan: "",
                          });
                          handleStep(3);
                        }}
                      >
                        Lewati
                        <FontAwesomeIcon icon={faForward} className="ms-1" />
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleStep(3)}
                        disabled={ukuranLama.rsph.length === 0}
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
                    <br />
                    <span>
                      * Klik Selanjutnya kalau mau simpan ukuran lamanya
                    </span>
                  </div>
                </Form>
              )}
              {/* Step 3 */}
              {step == 3 && (
                <>
                  <span className="text-danger" style={{ fontSize: "12px" }}>
                    * Wajib Diisi
                  </span>
                  <Form
                    id="form-ukuran-baru"
                    autoComplete="off"
                    onSubmit={handleSubmitAll}
                  >
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
                            value={ukuranBaru.rsph}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="rcyl"
                            size="sm"
                            type="text"
                            placeholder="CYL"
                            value={ukuranBaru.rcyl}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="raxis"
                            size="sm"
                            type="text"
                            placeholder="AXIS"
                            value={ukuranBaru.raxis}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-end  "
                            name="radd"
                            size="sm"
                            type="text"
                            placeholder="ADD"
                            value={ukuranBaru.radd}
                            onChange={(e) => handleChangeUbPower(e)}
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
                            value={ukuranBaru.lsph}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="lcyl"
                            size="sm"
                            type="text"
                            placeholder="CYL"
                            value={ukuranBaru.lcyl}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0"
                            name="laxis"
                            size="sm"
                            type="text"
                            placeholder="AXIS"
                            value={ukuranBaru.laxis}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs className="p-0">
                          <Form.Control
                            className="border border-primary rounded-0 rounded-end  "
                            name="ladd"
                            size="sm"
                            type="text"
                            placeholder="ADD"
                            value={ukuranBaru.ladd}
                            onChange={(e) => handleChangeUbPower(e)}
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
                            value={ukuranBaru.pd_jauh}
                            onChange={(e) => handleChangeUbPower(e)}
                          />
                        </Col>
                        <Col xs>
                          <Form.Control
                            className="border border-primary"
                            name="pd_dekat"
                            size="sm"
                            type="text"
                            placeholder="PD Dekat"
                            value={ukuranBaru.pd_dekat}
                            onChange={(e) => handleChangeUbPower(e)}
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
                        value={ukuranBaru.tanggal_periksa}
                        onChange={(e) => handleChangeUB(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Optik <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Select
                        name="optik_id"
                        className="border border-primary"
                        size="sm"
                        value={ukuranBaru.optik_id}
                        onChange={(e) => handleChangeUB(e)}
                      >
                        <option hidden>Nama optik</option>
                        {dataOptik.map((item, index) => (
                          <option key={index} value={item.id}>
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
                        required
                        placeholder="Pemeriksa"
                        value={ukuranBaru.pemeriksa}
                        onChange={(e) => handleChangeUB(e)}
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
                          value={keterangan.frame}
                          onChange={(e) =>
                            setKeterangan((prev) => ({
                              ...prev,
                              frame: e.target.value,
                            }))
                          }
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
                          value={keterangan.lensa}
                          onChange={(e) =>
                            setKeterangan((prev) => ({
                              ...prev,
                              lensa: e.target.value,
                            }))
                          }
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
                          value={keterangan.harga}
                          placeholder="0"
                          onChange={(e) =>
                            setKeterangan((prev) => ({
                              ...prev,
                              harga: addCommas(
                                removeNonNumeric(e.target.value)
                              ),
                            }))
                          }
                        />
                      </InputGroup>
                      <Form.Control
                        className="border border-primary"
                        name="keterangan"
                        as="textarea"
                        row={2}
                        placeholder="Keterangan lain"
                        value={ukuranBaru.keterangan}
                        onChange={(e) => handleChangeUB(e)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Lampiran <i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        ref={uploadFile}
                        onChange={(e) => loadImage(e)}
                        capture
                        hidden
                      />
                      <Card onClick={() => uploadFile.current.click()}>
                        {openPreview === true ? (
                          <Card.Body
                            className="d-flex justify-content-center"
                            style={{
                              borderStyle: "dashed",
                              borderColor: "grey",
                              cursor: "pointer",
                            }}
                          >
                            <Row>
                              <Col md={{ span: 8, offset: 2 }} xs>
                                <Image
                                  src={preview}
                                  fluid
                                  className="shadow bg-body rounded"
                                />
                              </Col>
                            </Row>
                          </Card.Body>
                        ) : (
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
                        )}
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
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          disabled={
                            ukuranBaru.rsph.length === 0 ||
                            ukuranBaru.lsph.length === 0 ||
                            ukuranBaru.optik_id.length === 0 ||
                            ukuranBaru.pemeriksa.length === 0 ||
                            file.length === 0
                          }
                        >
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
