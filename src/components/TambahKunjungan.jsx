import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  ProgressBar,
  Button,
  InputGroup,
  FormControl,
  Image,
  Form,
} from "react-bootstrap";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileImage,
  faMagnifyingGlass,
  faSave,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import axios from "axios";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

function TambahKunjungan({ onChangeTambahKunjungan }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [barStatus, setBarStatus] = useState(50);
  const [step, setStep] = useState(1);
  const closeTambahKunjungan = useCallback(() => {
    onChangeTambahKunjungan(false);
  }, [onChangeTambahKunjungan]);

  const uploadFile = useRef(null);
  const [file, setFile] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [preview, setPreview] = useState("");

  const [dataOptik, setDataOptik] = useState([]);

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  const [dataPasien, setDataPasien] = useState({
    id: "",
    nama: "",
    jenis_kelamin: "",
    alamat: "",
    ttl: "",
    nohp: "",
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

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      wrap: true,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat.toUpperCase(),
    },
    {
      name: "No hp",
      selector: (row) => row.nohp,
    },
  ];

  const handleStep = (numStep) => {
    if (numStep == 1) {
      setStep(1);
      setBarStatus(50);
    } else {
      setStep(2);
      setBarStatus(100);
    }
  };

  const pilihPasien = (row) => {
    setDataPasien({
      id: row.id,
      nama: row.nama,
      jenis_kelamin: row.jenis_kelamin,
      alamat: row.alamat,
      ttl: row.ttl,
      nohp: row.nohp,
    });
    handleStep(2);
  };

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

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

  // Submit Ukuran baru
  const handleSubmitUB = async (e) => {
    e.preventDefault();
    try {
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
          pasien_id: dataPasien.id,
        })
      );

      const response = await axios.post(API_URL + "rekam", formData, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });

      if (response.data.success) {
        closeTambahKunjungan();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const optik = await axios.get(API_URL + "optik");
      setDataOptik(optik.data.data);
      const response = await axios.get(API_URL + "pasien", {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });

      if (response.data.success === true) {
        setData(response.data.data);
        setFilter(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  useEffect(() => {
    const tokenDecode = jwtDecode(cookies.get("rm-ma-token"));
    setUkuranBaru((prevState) => ({
      ...prevState,
      optik_id: tokenDecode.user.id_optik || "",
    }));
    getData();
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.nohp.toString().includes(search.toLocaleLowerCase()) ||
        item.alamat.toLowerCase().includes(search.toLocaleLowerCase())
      );
    });

    setFilter(filterSearch);
  }, [search]);

  const conditionalRowStyles = [
    {
      when: (row) => row.terakhir_periksa == null,
      style: {
        backgroundColor: "#ffc107",
      },
    },
  ];

  return (
    <Card className="shadow">
      <Card.Body className="pt-1">
        <ProgressBar animated now={barStatus} style={{ height: "10px" }} />
        <Row>
          {step == 2 && (
            <Col md={{ span: 6, offset: 3 }} className="pt-2">
              <Button variant="default" size="sm" onClick={() => handleStep(1)}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Kembali
              </Button>
            </Col>
          )}
          <Col md={{ span: 8, offset: 2 }} className="pt-2">
            {step == 1 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => closeTambahKunjungan()}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Kembali
              </Button>
            )}
            <h5 className="text-center mb-0">
              {step == 1 ? "Pilih Pasien" : "Ukuran Baru"}
            </h5>
          </Col>
          {step == 1 && (
            <Col md={{ span: 8, offset: 2 }}>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                * Klik nama pasien nya aja <br />
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-warning me-1"
                  size="lg"
                />
                Belum diperiksa
                <FontAwesomeIcon
                  icon={faSquare}
                  className="me-1 ms-3"
                  style={{ color: "#e0e0e0" }}
                />
                Sudah diperiksa
              </p>
              <InputGroup className="mb-2">
                <InputGroup.Text id="search-data">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputGroup.Text>
                <FormControl
                  className="border border-primary"
                  type="text"
                  size="sm"
                  value={search}
                  autoComplete="off"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari Nama\No Hp\Alamat Disini..."
                />
              </InputGroup>
              <DataTable
                columns={columns}
                data={filter}
                pagination
                paginationPerPage={20}
                customStyles={tableCustomStyles}
                highlightOnHover
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={(row) => pilihPasien(row)}
              />
            </Col>
          )}
          {step == 2 && (
            <Col md={{ span: 6, offset: 3 }}>
              <>
                <table className="table table-sm table-detail mt-2">
                  <tbody>
                    <tr>
                      <td>Nama</td>
                      <td>:</td>
                      <td>{dataPasien.nama.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Jenis Kelamin</td>
                      <td>:</td>
                      <td>{dataPasien.jenis_kelamin}</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{dataPasien.alamat}</td>
                    </tr>
                    <tr>
                      <td>TTL</td>
                      <td>:</td>
                      <td>{dataPasien.ttl}</td>
                    </tr>
                    <tr>
                      <td>No Hp</td>
                      <td>:</td>
                      <td>{dataPasien.nohp}</td>
                    </tr>
                  </tbody>
                </table>
                <span className="text-danger" style={{ fontSize: "12px" }}>
                  * Wajib Diisi
                </span>
                <Form
                  id="form-ukuran-baru"
                  autoComplete="off"
                  onSubmit={handleSubmitUB}
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
                            harga: addCommas(removeNonNumeric(e.target.value)),
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
                  <div className="text-end">
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
                </Form>
              </>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
}

const tableCustomStyles = {
  headCells: {
    style: {
      fontWeight: "bold",
      backgroundColor: "#ebebeb",
    },
  },
  rows: {
    style: {
      minHeight: "35px", // override the row height
      cursor: "pointer",
    },
  },
};

export default TambahKunjungan;
