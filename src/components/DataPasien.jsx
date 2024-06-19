import {
  faCalendarDays,
  faEdit,
  faEye,
  faFilter,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faStore,
  faTrashCan,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  Dropdown,
  FormControl,
  InputGroup,
  Form,
  Badge,
  ButtonToolbar,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";

function DataPasien() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);

  // Filter
  const [search, setSearch] = useState("");
  const [namaOptik, setNamaOptik] = useState("");
  const [terakhirPeriksa, setTerakhirPeriksa] = useState("");

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
        moment.locale("id", {
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
          <Button variant="link" className="p-0 me-2 text-info">
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button variant="link" className="p-0 me-2 text-success">
            <FontAwesomeIcon icon={faWhatsapp} />
          </Button>
          <Button variant="link" className="p-0 me-2 text-success">
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
      ),
      width: "auto",
      right: true,
    },
  ];

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
      html: `Apakah kamu mau menghapus semua data <b class="text-uppercase">${nama}</b> ?`,
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
      console.log(error);
    }
  };

  const resetFilter = () => {
    setNamaOptik("");
    setTerakhirPeriksa("");
    setSearch("");
  };

  const getData = async () => {
    try {
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
      } else {
        cookies.remove("rm-ma-token");
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return (
        item.nama.toLowerCase().includes(search.toLocaleLowerCase()) ||
        item.nohp.toString().includes(search.toLocaleLowerCase())
      );
    });
    const filterNamaOptik = filterSearch.filter((item) => {
      return item.id_optik.toString().includes(namaOptik.split("-")[0]);
    });

    const filterTglPeriksa = filterNamaOptik.filter((item) => {
      const TODAY = moment().clone().startOf("day");
      const YESTERDAY = moment().clone().subtract(1, "days").startOf("day");
      const THISWEEK = moment().clone().subtract(7, "days").startOf("day");
      const THISMONTH = moment().clone().subtract(30, "days").startOf("day");
      const _3MONTH = moment().clone().subtract(90, "day").startOf("day");
      const _6MONTH = moment().clone().subtract(180, "day").startOf("day");
      if (terakhirPeriksa == "Hari Ini") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isSame(TODAY, "d");
      } else if (terakhirPeriksa == "Kemarin") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isSame(YESTERDAY, "d");
      } else if (terakhirPeriksa == "Minggu Ini") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isAfter(THISWEEK);
      } else if (terakhirPeriksa == "Bulan Ini") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isAfter(THISMONTH);
      } else if (terakhirPeriksa == "3 Bulan Lalu") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isAfter(_3MONTH);
      } else if (terakhirPeriksa == "6 Bulan Lalu") {
        return moment(
          moment(item.terakhir_periksa).format("YYYY-MM-DD")
        ).isAfter(_6MONTH);
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
                    <option key={index} value={item.id + "-" + item.nama_optik}>
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
          <DataTable
            className="mw-100"
            columns={columns}
            data={filter}
            pagination
            paginationPerPage={20}
            customStyles={tableCustomStyles}
          />
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

export default DataPasien;
