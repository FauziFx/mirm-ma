import {
  faArrowLeft,
  faCalendarDays,
  faCaretRight,
  faEdit,
  faEye,
  faFileImage,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faStore,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  FormControl,
  InputGroup,
  Form,
  Badge,
  ButtonToolbar,
  Accordion,
  Modal,
  Image,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import LoadingOverlay from "react-loading-overlay-ts";
import EditPasien from "./EditPasien";
import WaPasien from "./WaPasien";

function DataPasien({ user }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showLampiran, setShowLampiran] = useState(false);
  const [preview, setPreview] = useState({
    nama: "",
    tanggal: "",
    url: "",
  });

  const [loadImg, setLoadImg] = useState(false);

  const [dataEdit, setDataEdit] = useState({});
  const [dataWA, setDataWA] = useState({});

  const handleShowLampiran = (data) => {
    setLoadImg(true);
    setPreview(data);
    setShowLampiran(true);
  };

  const handleCloseLampiran = () => {
    setShowLampiran(false);
    setPreview({ nama: "", tanggal: "", url: "" });
  };

  // Detail
  const [detail, setDetail] = useState({
    id: "",
    nama: "",
    alamat: "",
    ttl: "",
    usia: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
    tanggal: "",
    nama_optik: "",
    id_optik: "",
    dataKunjungan: [],
  });

  // Filter
  const [search, setSearch] = useState("");
  const [namaOptik, setNamaOptik] = useState("");
  const [terakhirPeriksa, setTerakhirPeriksa] = useState("");

  // CRUD
  const crudState = {
    show: false,
    detail: false,
    edit: false,
    wa: false,
  };
  const [crud, setCrud] = useState(crudState);

  const columns = [
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
      wrap: true,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat.toUpperCase(),
      sortable: true,
    },
    {
      name: "No Hp",
      selector: (row) => row.nohp,
      sortable: true,
      hide: "sm",
    },
    {
      name: "Terkahir Periksa",
      selector: (row) => {
        moment.updateLocale("id", {
          calendar: {
            lastDay: "[Kemarin]",
            sameDay: "[Hari Ini]",
            nextDay: "[Besok]",
            lastWeek: "dddd",
            nextWeek: "dddd",
            sameElse: "llll",
          },
        });
        const tgl = row.terakhir_periksa;
        const terakhirPeriksa = isNaN(tgl) ? moment(tgl).calendar() : "";
        const tglTerakhirPeriksa = terakhirPeriksa.toString().split("pukul");
        return (
          tglTerakhirPeriksa[0] || <Badge bg="danger">Belum Periksa</Badge>
        );
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Optik",
      selector: (row) => row.nama_optik,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Button
            variant="link"
            className="p-0 me-2 text-info"
            onClick={() => showDetail(row)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="link"
            className="p-0 me-2 text-success"
            onClick={() => showWa(row.nama, row.nohp)}
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </Button>
          {user.role == "admin" && (
            <>
              <Button
                variant="link"
                className="p-0 me-2 text-success"
                onClick={() => showEdit(row)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                variant="link"
                className="p-0 me-2 text-danger"
                onClick={() => confirmDelete(row.id, row.nama)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </>
          )}
        </>
      ),
      width: "auto",
      right: true,
    },
  ];

  // Show Detail
  const showDetail = async (row) => {
    try {
      setLoadingDetail(true);
      setCrud((state) => ({ ...crudState, detail: true }));
      const response = await axios.get(API_URL + "rekam/" + row.id, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      if (response.data.success) {
        const ttl = row.ttl;
        const year = ttl.substr(ttl.length - 5);
        const usia = Math.abs(year - new Date().getFullYear());
        setDetail({
          id: row.id,
          nama: row.nama,
          alamat: row.alamat,
          ttl: row.ttl,
          usia: usia,
          jenis_kelamin: row.jenis_kelamin,
          pekerjaan: row.pekerjaan,
          nohp: row.nohp,
          riwayat: row.riwayat,
          tanggal: row.tanggal,
          nama_optik: row.nama_optik,
          id_optik: row.id_optik,
          dataKunjungan: response.data.data,
        });
        setLoadingDetail(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Show Edit
  const showEdit = async (row) => {
    setCrud((state) => ({ ...crudState, edit: true }));
    setDataEdit(row);
  };

  // Show WhatsApp
  const showWa = (nama, nohp) => {
    setCrud((state) => ({ ...crudState, wa: true }));
    setDataWA({ nama: nama, nohp: nohp });
  };

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const confirmDelete = (id, nama) => {
    Swal.fire({
      html: `<p class="mb-0">Apakah kamu mau menghapus semua data <br/> <b class="text-uppercase">${nama}</b> ?</p>`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deletePasien(id);
      }
    });
  };

  const deletePasien = async (id) => {
    try {
      const response = await axios.delete(API_URL + "pasien/" + id, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      if (response.data.success) {
        Toast.fire({
          icon: "success",
          title: "Data berhasil Dihapus!",
        });
        getData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const resetFilter = () => {
    setNamaOptik("");
    setTerakhirPeriksa("");
    setSearch("");
  };

  const getData = async () => {
    try {
      setLoadingData(true);
      const optik = await axios.get(API_URL + "/optik");
      setDataOptik(optik.data.data);
      const response = await axios.get(API_URL + "/pasien", {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      const res = response.data;
      if (res.success) {
        setData(res.data);
        setFilter(res.data);
        setLoadingData(false);
      } else {
        cookies.remove("rm-ma-token");
        return navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
    setCrud((state) => ({ ...crudState, show: true }));
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.nohp.toString().includes(search.toLocaleLowerCase())
      );
    });
    const filterNamaOptik = filterSearch.filter((item) => {
      return (item.id_optik + "-" + item.nama_optik)
        .toLowerCase()
        .includes(namaOptik.toLocaleLowerCase());
    });

    const filterTglPeriksa = filterNamaOptik.filter((item) => {
      const TODAY = moment().clone().startOf("day");
      const YESTERDAY = moment().clone().subtract(1, "days").startOf("day");
      const THISWEEK = moment().clone().subtract(7, "days").startOf("day");
      const THISMONTH = moment().clone().subtract(30, "days").startOf("day");
      const _3MONTH = moment().clone().subtract(90, "day").startOf("day");
      const _6MONTH = moment().clone().subtract(180, "day").startOf("day");
      const tglPeriksa = moment(item.terakhir_periksa).format("YYYY-MM-DD");
      if (terakhirPeriksa == "Hari Ini") {
        return moment(tglPeriksa).isSame(TODAY, "d");
      } else if (terakhirPeriksa == "Kemarin") {
        return moment(tglPeriksa).isSame(YESTERDAY, "d");
      } else if (terakhirPeriksa == "Minggu Ini") {
        return moment(tglPeriksa).isAfter(THISWEEK);
      } else if (terakhirPeriksa == "Bulan Ini") {
        return moment(tglPeriksa).isAfter(THISMONTH);
      } else if (terakhirPeriksa == "3 Bulan Lalu") {
        return moment(tglPeriksa).isAfter(_3MONTH);
      } else if (terakhirPeriksa == "6 Bulan Lalu") {
        return moment(tglPeriksa).isAfter(_6MONTH);
      } else if (terakhirPeriksa == "Belum Periksa") {
        return item.terakhir_periksa == null;
      } else {
        return true;
      }
    });

    setFilter(filterTglPeriksa);
  }, [search, namaOptik, terakhirPeriksa]);

  return (
    <>
      <Card className="shadow">
        <Card.Body>
          {/* Data Pasien */}
          {crud.show === true && (
            <>
              <Row>
                <Col md={3} sm={12} className="mb-2">
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="filter-optik">
                      <FontAwesomeIcon icon={faStore} />
                    </InputGroup.Text>
                    <Form.Select
                      className="border border-primary"
                      size="sm"
                      value={namaOptik}
                      onChange={(e) => setNamaOptik(e.target.value)}
                    >
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
                  </InputGroup>
                </Col>
                <Col md={3} sm={12} className="mb-2">
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="filter-tanggal">
                      <FontAwesomeIcon icon={faCalendarDays} />
                    </InputGroup.Text>
                    <Form.Select
                      className="border border-primary"
                      size="sm"
                      value={terakhirPeriksa}
                      onChange={(e) => setTerakhirPeriksa(e.target.value)}
                    >
                      <option hidden>Terakhir Periksa</option>
                      <option value="Belum Periksa">Belum Periksa</option>
                      <option value="Hari Ini">Hari Ini</option>
                      <option value="Kemarin">Kemarin</option>
                      <option value="Minggu Ini">Minggu Ini</option>
                      <option value="Bulan Ini">Bulan Ini</option>
                      <option value="3 Bulan Lalu">3 Bulan Lalu</option>
                      <option value="6 Bulan Lalu">6 Bulan Lalu</option>
                    </Form.Select>
                  </InputGroup>
                </Col>
                <Col md={{ span: 4, offset: 2 }} sm={12}>
                  <div className="search-box d-inline">
                    <InputGroup className="mb-2">
                      <InputGroup.Text id="search-data">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </InputGroup.Text>
                      <FormControl
                        className="border border-primary"
                        type="text"
                        size="sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari Nama\No Hp Disini..."
                      />
                    </InputGroup>
                  </div>
                </Col>
              </Row>
              <Row>
                <ButtonToolbar className="mb-2">
                  {(search || namaOptik || terakhirPeriksa) && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={() => resetFilter()}
                      >
                        Reset <FontAwesomeIcon icon={faFilterCircleXmark} />
                      </Button>
                      <h6 className="m-0 ms-1 mt-1">
                        {search && (
                          <Badge bg="primary" className="fw-light me-1">
                            {search}
                          </Badge>
                        )}
                        {namaOptik && (
                          <Badge bg="primary" className="fw-light me-1">
                            {namaOptik.split("-")[1]}
                          </Badge>
                        )}
                        {terakhirPeriksa && (
                          <Badge bg="primary" className="fw-light me-1">
                            {terakhirPeriksa}
                          </Badge>
                        )}
                      </h6>
                    </>
                  )}
                </ButtonToolbar>
              </Row>
              <LoadingOverlay
                active={loadingData}
                spinner
                text="Sedang Memuat..."
              >
                <DataTable
                  className="mw-100"
                  columns={columns}
                  data={filter}
                  pagination
                  paginationPerPage={20}
                  customStyles={tableCustomStyles}
                />
              </LoadingOverlay>
            </>
          )}

          {/* Detail */}
          {crud.detail === true && (
            <>
              <LoadingOverlay
                active={loadingDetail}
                spinner
                text="Sedang Memuat..."
              >
                <Row>
                  <Col md={6}>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setCrud((state) => ({ ...crudState, show: true }));
                          setLoadingDetail(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                        Kembali
                      </Button>
                      <div>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-1"
                          onClick={() => showWa(detail.nama, detail.nohp)}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            const dataShowEdit = {
                              id: detail.id,
                              nama: detail.nama,
                              alamat: detail.alamat,
                              ttl: detail.ttl,
                              jenis_kelamin: detail.jenis_kelamin,
                              pekerjaan: detail.pekerjaan,
                              nohp: detail.nohp,
                              riwayat: detail.riwayat,
                              id_optik: detail.id_optik,
                            };
                            showEdit(dataShowEdit);
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} className="me-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <h5 className="text-center mt-1 text-uppercase">
                      {detail.nama}
                    </h5>
                    <table className="table table-sm table-detail">
                      <tbody>
                        <tr>
                          <td className="fw-semibold">Tanggal</td>
                          <td>:</td>
                          <td>
                            {moment(detail.tanggal)
                              .tz("Asia/Jakarta")
                              .format("DD MMMM YYYY")}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Optik</td>
                          <td>:</td>
                          <td>{detail.nama_optik}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Alamat</td>
                          <td>:</td>
                          <td>{detail.alamat}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Usia</td>
                          <td>:</td>
                          <td>{detail.usia} Tahun</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">TTL</td>
                          <td>:</td>
                          <td>{detail.ttl}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Jenis Kelamin</td>
                          <td>:</td>
                          <td>{detail.jenis_kelamin}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Pekerjaan</td>
                          <td>:</td>
                          <td>{detail.pekerjaan}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">No Hp</td>
                          <td>:</td>
                          <td>{detail.nohp}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h6 className="mt-1">Riwayat Penyakit</h6>
                    <ul className="list-group list-group-flush table-detail mb-4">
                      {detail.riwayat.split(",").map((item, index) => (
                        <li key={index} className="list-group-item py-1">
                          <FontAwesomeIcon
                            className="me-1"
                            icon={faCaretRight}
                            size="xs"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col
                    md={6}
                    style={{ height: "550px" }}
                    className="overflow-y-scroll"
                  >
                    <h6 className="text-center mt-1">Data Kunjungan Pasien</h6>
                    <Accordion defaultActiveKey="0">
                      {detail.dataKunjungan.length !== 0 &&
                        detail.dataKunjungan.map((item, index) => (
                          <Accordion.Item eventKey={index} key={index}>
                            <Accordion.Header>
                              <span style={{ fontSize: "14px" }}>
                                {moment(item.tanggal)
                                  .tz("Asia/Jakarta")
                                  .format("dddd, DD MMMM YYYY")}
                              </span>
                              {item.ukuran_lama == "y" && (
                                <Badge bg="secondary" className="ms-1">
                                  Ukuran Lama
                                </Badge>
                              )}
                            </Accordion.Header>
                            <Accordion.Body className="p-1">
                              {item.ukuran_lama == "n" && (
                                <table className="table table-sm table-detail mb-0">
                                  <tbody>
                                    <tr>
                                      <td>Optik</td>
                                      <td>:</td>
                                      <td>{item.nama_optik}</td>
                                    </tr>
                                    <tr>
                                      <td>Pemeriksa</td>
                                      <td>:</td>
                                      <td>{item.pemeriksa}</td>
                                    </tr>
                                    {item.ukuran_lama == "n" && (
                                      <tr>
                                        <td>Lampiran</td>
                                        <td>:</td>
                                        <td>
                                          <Button
                                            variant="primary"
                                            size="sm"
                                            className="mb-2"
                                            onClick={() => {
                                              const data = {
                                                nama: detail.nama,
                                                tanggal: moment(item.tanggal)
                                                  .tz("Asia/Jakarta")
                                                  .format("dddd, DD MMMM YYYY"),
                                                url: item.url,
                                              };
                                              handleShowLampiran(data);
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faFileImage}
                                              className="me-1"
                                            />
                                            Lihat Lampiran
                                          </Button>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              )}
                              <b>Keterangan :</b>
                              <br />
                              <p
                                className="mb-1 ps-2 table-detail"
                                style={{ whiteSpace: "pre-wrap" }}
                              >
                                {item.keterangan}
                              </p>
                              <table className="table table-sm table-bordered table-detail">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Sph</th>
                                    <th>Cyl</th>
                                    <th>Axis</th>
                                    <th>Add</th>
                                    <th>PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th>OD</th>
                                    <td>{item.od.split("/")[0]}</td>
                                    <td>{item.od.split("/")[1]}</td>
                                    <td>{item.od.split("/")[2]}</td>
                                    <td>{item.od.split("/")[3]}</td>
                                    <td rowSpan={2}>
                                      {item.pd_jauh !== null && item.pd_jauh}/
                                      {item.pd_dekat !== null && item.pd_dekat}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>OS</th>
                                    <td>{item.os.split("/")[0]}</td>
                                    <td>{item.os.split("/")[1]}</td>
                                    <td>{item.os.split("/")[2]}</td>
                                    <td>{item.os.split("/")[3]}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                    </Accordion>
                  </Col>
                </Row>
              </LoadingOverlay>
            </>
          )}

          {/* Edit */}
          {crud.edit === true && (
            <EditPasien
              dataOptik={dataOptik}
              setCrud={setCrud}
              dataPasien={dataEdit}
              getData={getData}
            />
          )}

          {/* WhatsApp */}
          {crud.wa === true && <WaPasien dataWA={dataWA} setCrud={setCrud} />}
        </Card.Body>
      </Card>

      {/* Modal Show Lampiran */}
      <Modal
        show={showLampiran}
        onHide={() => handleCloseLampiran()}
        centered
        scrollable
      >
        <Modal.Header closeButton style={{ fontSize: "14px" }} className="py-1">
          <div>
            {preview.nama}
            <br />
            <i style={{ fontSize: "12px" }}>{preview.tanggal}</i>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center">
          <LoadingOverlay active={loadImg} spinner text="Sedang Memuat...">
            <Image src={preview.url} fluid onLoad={() => setLoadImg(false)} />
          </LoadingOverlay>
        </Modal.Body>
      </Modal>
    </>
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
      minHeight: "40px", // override the row height
    },
  },
};

export default DataPasien;
