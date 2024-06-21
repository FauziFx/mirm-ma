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
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  faCalendarDay,
  faEye,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faStore,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import "moment/dist/locale/id";

function KunjunganPasien() {
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
          <Button variant="link" className="p-0 me-2 text-info">
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button variant="link" className="p-0 me-2 text-danger">
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
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
    const filterOptik = namaOptik.split("-");
    const filterNamaOptik = filterSearch.filter((item) => {
      return (item.optik_id || "").toString().includes(filterOptik[0]);
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

    // setFilter(filterSearch);
    // setFilter(filterNamaOptik);
    setFilter(filterTglPeriksa);
  }, [search, namaOptik, tanggalPeriksa]);
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

export default KunjunganPasien;
