import {
  faArrowLeft,
  faFilterCircleXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonToolbar,
  Card,
  Col,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Cookies from "universal-cookie";
import LoadingOverlay from "react-loading-overlay-ts";

function CekStok1() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataStok, setDataStok] = useState([]);
  const [filterStok, setFilterStok] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingStok, setLoadingStok] = useState(false);
  const [namaLensa, setNamaLensa] = useState("");

  // Filter
  const [search, setSearch] = useState("");
  const [searchStok, setSearchStok] = useState("");

  const stokState = {
    lensa: false,
    stok: false,
  };
  const [crud, setCrud] = useState(stokState);

  const columns = [
    {
      name: "Nama Lensa",
      selector: (row) => row.nama,
    },
  ];

  const columnsStok = [
    {
      name: "Power",
      selector: (row) => row.nama_varian,
    },
    {
      name: "Stok",
      selector: (row) => row.stok,
      conditionalCellStyles: [
        {
          when: (row) => row.stok <= 0,
          style: {
            backgroundColor: "#dc3545",
            color: "white",
          },
        },
        {
          when: (row) => row.stok === 1,
          style: {
            backgroundColor: "#ffc107",
            color: "white",
          },
        },
      ],
    },
  ];

  const getStok = async (nama_lensa) => {
    try {
      setLoadingStok(true);
      setNamaLensa(nama_lensa);
      setSearch("");
      const response = await axios.get(API_URL + "stok", {
        params: {
          nama_lensa: nama_lensa,
        },
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      if (response.data.success) {
        setDataStok(response.data.data);
        setFilterStok(response.data.data);
        setCrud((state) => ({ ...stokState, stok: true }));
        setLoadingStok(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getData = async () => {
    try {
      setLoadingData(true);
      const response = await axios.get(API_URL + "lensa", {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      if (response.data.success) {
        setData(response.data.data);
        setFilter(response.data.data);
        setLoadingData(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setCrud((state) => ({ ...stokState, lensa: true }));
    getData();
  }, []);

  useEffect(() => {
    let filterSearch = data.filter((item) => {
      return item.nama.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(filterSearch);
  }, [search]);

  useEffect(() => {
    let filterSearch = dataStok.filter((item) => {
      return item.nama_varian
        .toLowerCase()
        .includes(searchStok.toLocaleLowerCase());
    });
    setFilterStok(filterSearch);
  }, [searchStok]);

  return (
    <Card className="shadow">
      <Card.Body>
        {crud.lensa === true && (
          <>
            <Row>
              <Col md={{ span: 5, offset: 7 }}>
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
                      placeholder="Cari Nama lensa Disini..."
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <ButtonToolbar className="mb-2">
                {search && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => setSearch("")}
                    >
                      Reset <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </Button>
                    <h6 className="m-0 ms-1 mt-1">
                      {search && (
                        <Badge bg="primary" className="fw-light me-1">
                          {search}
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
                highlightOnHover
                onRowClicked={(row) => getStok(row.nama)}
              />
            </LoadingOverlay>
          </>
        )}
        {crud.stok === true && (
          <>
            <Row>
              <Col md={3}>
                <Button
                  variant="default"
                  className="mb-1"
                  size="sm"
                  onClick={() => {
                    setCrud((state) => ({ ...stokState, lensa: true }));
                    setSearchStok("");
                  }}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                  Kembali
                </Button>
              </Col>
              <Col md={4}>
                <div className="mb-2 fw-bold">{namaLensa}</div>
              </Col>
              <Col md={5}>
                <div className="search-box d-inline">
                  <InputGroup className="mb-2">
                    <InputGroup.Text id="search-data">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </InputGroup.Text>
                    <FormControl
                      className="border border-primary"
                      type="text"
                      size="sm"
                      value={searchStok}
                      onChange={(e) => setSearchStok(e.target.value)}
                      placeholder="Cari Ukuran lensa Disini..."
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
            <Row>
              <ButtonToolbar className="mb-2">
                {search && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => setSearchStok("")}
                    >
                      Reset <FontAwesomeIcon icon={faFilterCircleXmark} />
                    </Button>
                    <h6 className="m-0 ms-1 mt-1">
                      {search && (
                        <Badge bg="primary" className="fw-light me-1">
                          {searchStok}
                        </Badge>
                      )}
                    </h6>
                  </>
                )}
              </ButtonToolbar>
            </Row>
            <LoadingOverlay
              active={loadingStok}
              spinner
              text="Sedang Memuat..."
            >
              <DataTable
                className="mw-100"
                columns={columnsStok}
                data={filterStok}
                pagination
                paginationPerPage={20}
                customStyles={tableCustomStyles2}
              />
            </LoadingOverlay>
          </>
        )}
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
      minHeight: "40px", // override the row height
    },
  },
};

const tableCustomStyles2 = {
  headCells: {
    style: {
      fontWeight: "bold",
      backgroundColor: "#ebebeb",
    },
  },
  rows: {
    style: {
      minHeight: "35px", // override the row height
    },
  },
};

export default CekStok1;
