import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  InputGroup,
  Form,
  FormControl,
  ButtonToolbar,
  Button,
  Badge,
  Image,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  faArrowLeft,
  faCalendarDay,
  faCaretRight,
  faEye,
  faFileImage,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faStore,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import LoadingOverlay from "react-loading-overlay-ts";
import Swal from "sweetalert2";

function KunjunganPasien({ user }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);
  // Filter
  const [search, setSearch] = useState("");
  const [namaOptik, setNamaOptik] = useState("");
  const [tanggalPeriksa, setTanggalPeriksa] = useState("");

  const resetFilter = () => {
    setNamaOptik("");
    setTanggalPeriksa("");
    setSearch("");
    setFilter(data);
  };

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  // CRUD
  const crudState = {
    show: false,
    detail: false,
  };
  const [crud, setCrud] = useState(crudState);

  const [loadingData, setLoadingData] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Detail
  const [detail, setDetail] = useState({
    nama: "",
    alamat: "",
    ttl: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
    id: 0,
    od: "",
    os: "",
    pd_jauh: "",
    pd_dekat: "",
    tanggal_periksa: "",
    nama_optik: "",
    pemeriksa: "",
    keterangan: "",
    ukuran_lama: "",
    tanggal: "",
  });

  const showDetail = (row) => {
    setLoadingDetail(true);
    setCrud((state) => ({ ...crudState, detail: true }));
    setDetail({
      nama: row.nama.toUpperCase(),
      alamat: row.alamat,
      ttl: row.ttl,
      jenis_kelamin: row.jenis_kelamin,
      pekerjaan: row.pekerjaan,
      nohp: row.nohp,
      riwayat: row.riwayat,
      id: row.id,
      od: row.od.split("/"),
      os: row.os.split("/"),
      pd_jauh: row.pd_jauh,
      pd_dekat: row.pd_dekat,
      tanggal_periksa: row.tanggal_periksa,
      nama_optik: row.nama_optik,
      pemeriksa: row.pemeriksa,
      keterangan: row.keterangan,
      ukuran_lama: row.ukuran_lama,
      tanggal: row.tanggal,
      url: row.url,
    });
    setLoadingDetail(false);
  };

  const confirmDelete = (id, nama, image, tglPeriksa) => {
    const result =
      tglPeriksa !== null
        ? `kunjungan <br/> <b class="text-uppercase">${nama}</b> ditanggal ` +
          moment(tglPeriksa).tz("Asia/Jakarta").format("DD MMMM YYYY")
        : `Ukuran lama nya <br/> <b class="text-uppercase">${nama}</b>`;
    Swal.fire({
      html: `<p class="mb-0">Apakah kamu mau menghapus data ${result} ?</p>`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteKunjungan(id, image);
      }
    });
  };

  const deleteKunjungan = async (id, image) => {
    try {
      const img = image || "image";
      const response = await axios.delete(API_URL + "rekam/" + id + "/" + img, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      if (response.data.success) {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Tanggal",
      selector: (row) =>
        row.tanggal_periksa
          ? moment(row.tanggal_periksa).format("DD/MM/YYYY")
          : moment(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Pemeriksa",
      selector: (row) =>
        row.ukuran_lama === "n" ? (
          row.pemeriksa
        ) : (
          <Badge bg="secondary">Ukuran Lama</Badge>
        ),
      sortable: true,
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
          {user.role == "admin" && (
            <Button
              variant="link"
              className="p-0 me-2 text-danger"
              onClick={() =>
                confirmDelete(row.id, row.nama, row.image, row.tanggal_periksa)
              }
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          )}
        </>
      ),
      width: "auto",
      right: true,
    },
  ];

  const getData = async () => {
    try {
      const optik = await axios.get(API_URL + "optik");
      setDataOptik(optik.data.data);
      const response = await axios.get(API_URL + "rekam", {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      const res = response.data;
      if (res.success) {
        setData(res.data);
        setFilter(res.data);
      }
    } catch (error) {
      console.log(error);
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
        (item.pemeriksa || "")
          .toLowerCase()
          .includes(search.toLocaleLowerCase())
      );
    });
    const filterNamaOptik = filterSearch.filter((item) => {
      return (item.optik_id + "-" + item.nama_optik)
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
      const tglPeriksa = moment(item.tanggal_periksa || item.tanggal).format(
        "YYYY-MM-DD"
      );
      if (tanggalPeriksa == "Hari Ini") {
        return moment(tglPeriksa).isSame(TODAY, "d");
      } else if (tanggalPeriksa == "Kemarin") {
        return moment(tglPeriksa).isSame(YESTERDAY, "d");
      } else if (tanggalPeriksa == "Minggu Ini") {
        return moment(tglPeriksa).isAfter(THISWEEK);
      } else if (tanggalPeriksa == "Bulan Ini") {
        return moment(tglPeriksa).isAfter(THISMONTH);
      } else if (tanggalPeriksa == "3 Bulan Lalu") {
        return moment(tglPeriksa).isAfter(_3MONTH);
      } else if (tanggalPeriksa == "6 Bulan Lalu") {
        return moment(tglPeriksa).isAfter(_6MONTH);
      } else {
        return true;
      }
    });

    setFilter(filterTglPeriksa);
  }, [search, namaOptik, tanggalPeriksa]);
  return (
    <>
      <Card className="shadow">
        <Card.Body>
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
                      <FontAwesomeIcon icon={faCalendarDay} />
                    </InputGroup.Text>
                    <Form.Select
                      className="border border-primary"
                      size="sm"
                      value={tanggalPeriksa}
                      onChange={(e) => setTanggalPeriksa(e.target.value)}
                    >
                      <option hidden>Tanggal Periksa</option>
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
                        placeholder="Cari Nama\Pemeriksa Disini..."
                      />
                    </InputGroup>
                  </div>
                </Col>
              </Row>
              <Row>
                <ButtonToolbar className="mb-2">
                  {(search || namaOptik || tanggalPeriksa) && (
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
                        {tanggalPeriksa && (
                          <Badge bg="primary" className="fw-light me-1">
                            {tanggalPeriksa}
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
          {crud.detail === true && (
            <>
              <LoadingOverlay
                active={loadingDetail}
                spinner
                text="Sedang Memuat..."
              >
                <Row>
                  <Col md={6}>
                    <div className="text-start">
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
                  <Col md={6}>
                    <h6 className="text-center mt-1">Data Kunjungan Pasien</h6>
                    <table className="table table-sm table-detail mb-0">
                      <tbody>
                        <tr>
                          <td>Tanggal Periksa</td>
                          <td>:</td>
                          <td>
                            {detail.tanggal_periksa ? (
                              moment(detail.tanggal_periksa)
                                .tz("Asia/Jakarta")
                                .format("dddd, DD MMMM YYYY")
                            ) : (
                              <Badge bg="secondary">Ukuran Lama</Badge>
                            )}
                          </td>
                        </tr>
                        {detail.ukuran_lama == "n" && (
                          <>
                            <tr>
                              <td>Optik</td>
                              <td>:</td>
                              <td>{detail.nama_optik}</td>
                            </tr>
                            <tr>
                              <td>Pemeriksa</td>
                              <td>:</td>
                              <td>{detail.pemeriksa}</td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                    <b>Keterangan :</b>
                    <br />
                    <p
                      className="mb-1 ps-2 table-detail"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {detail.keterangan}
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
                          <td>{detail.od[0]}</td>
                          <td>{detail.od[1]}</td>
                          <td>{detail.od[2]}</td>
                          <td>{detail.od[3]}</td>
                          <td rowSpan={2}>
                            {detail.pd_jauh !== null && detail.pd_jauh}/
                            {detail.pd_dekat !== null && detail.pd_dekat}
                          </td>
                        </tr>
                        <tr>
                          <th>OS</th>
                          <td>{detail.os[0]}</td>
                          <td>{detail.os[1]}</td>
                          <td>{detail.os[2]}</td>
                          <td>{detail.os[3]}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Row>
                      <h6 className="text-center">Lampiran</h6>
                      <Col md={{ span: 8, offset: 2 }}>
                        <Image
                          src={detail.url}
                          fluid
                          className="shadow bg-body rounded"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </LoadingOverlay>
            </>
          )}
        </Card.Body>
      </Card>
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

export default KunjunganPasien;
