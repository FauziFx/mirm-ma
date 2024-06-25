import {
  faEye,
  faFilterCircleXmark,
  faHandHoldingMedical,
  faMagnifyingGlass,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonToolbar,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import axios from "axios";

function DataGaransi() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // filter
  const [search, setSearch] = useState("");
  const [namaOptik, setNamaOptik] = useState("");

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
      left: true,
      width: "fit-content",
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Optik",
      selector: (row) => row.nama_optik, //sementara
      sortable: true,
    },
    {
      name: "Lensa",
      selector: (row) => row.lensa.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Button variant="link" className="p-0 me-3 text-success">
            <FontAwesomeIcon icon={faHandHoldingMedical} />
          </Button>
          <Button variant="link" className="p-0 me-2 text-info">
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </>
      ),
      width: "fit-content",
      right: true,
    },
  ];

  const getData = async () => {
    try {
      setLoadingData(true);
      const optik = await axios.get(API_URL + "optik");
      setDataOptik(optik.data.data);

      const response = await axios.get(API_URL + "garansi");
      setData(response.data.data);
      setFilter(response.data.data);
      setLoadingData(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return item.nama.toLowerCase().includes(search.toLocaleLowerCase());
    });
    const filterNamaOptik = filterSearch.filter((item) => {
      return (item.optik_id + "-" + item.nama_optik)
        .toLowerCase()
        .includes(namaOptik.toLocaleLowerCase());
    });

    setFilter(filterNamaOptik);
  }, [search, namaOptik]);

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
            <Col md={{ span: 4, offset: 5 }} sm={12}>
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
                    placeholder="Cari Nama Disini..."
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
          <Row>
            <ButtonToolbar className="mb-2">
              {(search || namaOptik) && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSearch("");
                      setNamaOptik("");
                    }}
                  >
                    Reset <FontAwesomeIcon icon={faFilterCircleXmark} />
                  </Button>
                  <h6 className="m-0 ms-1 mt-1">
                    <Badge bg="primary" className="fw-light me-1">
                      {search}
                    </Badge>
                    <Badge bg="primary" className="fw-light me-1">
                      {namaOptik.split("-")[1]}
                    </Badge>
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

export default DataGaransi;
