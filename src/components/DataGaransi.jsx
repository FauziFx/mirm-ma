import {
  faArrowLeft,
  faCaretRight,
  faEye,
  faFilterCircleXmark,
  faHandHoldingMedical,
  faMagnifyingGlass,
  faSquare,
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
import LoadingOverlay from "react-loading-overlay-ts";
import KlaimGaransi from "./KlaimGaransi";

function DataGaransi() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [dataOptik, setDataOptik] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // filter
  const [search, setSearch] = useState("");
  const [namaOptik, setNamaOptik] = useState("");

  const [dataGaransi, setDataGaransi] = useState({
    tanggal: "",
    garansi_id: "",
    nama: "",
    frame: "",
    lensa: "",
  });

  // CRUD
  const crudState = {
    show: false,
    detail: false,
    klaim: false,
  };
  const [crud, setCrud] = useState(crudState);

  // Detail
  const [detail, setDetail] = useState({
    nama: "",
    frame: "",
    lensa: "",
    r: "",
    l: "",
    garansi_lensa: "",
    garansi_frame: "",
    expired_lensa: "",
    expired_frame: "",
    status_lensa: "",
    status_frame: "",
    tanggal: "",
    nama_optik: "",
    data_klaim: [],
  });

  const showDetail = async (row) => {
    try {
      let lensaIsGaransi = row.garansi_lensa !== "-" ? true : false;
      let frameIsGaransi = row.garansi_frame !== "-" ? true : false;
      let lensaIsExpired = await garansiIsExpired(moment(row.expired_lensa));
      let frameIsExpired = await garansiIsExpired(moment(row.expired_frame));
      let lensaIsClaimed = row.claimed_lensa === "0" ? true : false;
      let frameIsClaimed = row.claimed_frame === "0" ? true : false;

      const status_lensa = await garansiStatus(
        lensaIsGaransi,
        lensaIsExpired,
        lensaIsClaimed
      );

      const status_frame = await garansiStatus(
        frameIsGaransi,
        frameIsExpired,
        frameIsClaimed
      );

      const response = await axios.get(API_URL + "garansi_klaim/" + row.id, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });
      setDetail({
        nama: row.nama,
        frame: row.frame,
        lensa: row.lensa,
        r: row.r.split("/"),
        l: row.l.split("/"),
        garansi_lensa: row.garansi_lensa,
        garansi_frame: row.garansi_frame,
        expired_lensa: moment(row.expired_lensa).format("DD/MM/YYYY"),
        expired_frame: moment(row.expired_frame).format("DD/MM/YYYY"),
        status_lensa: status_lensa,
        status_frame: status_frame,
        tanggal: row.tanggal,
        nama_optik: row.nama_optik,
        data_klaim: response.data.data,
      });

      console.log(response.data.data);
      setCrud((state) => ({ ...crudState, detail: true }));
    } catch (error) {
      console.log(error);
    }
  };

  const showEdit = (row) => {
    setDataGaransi({
      tanggal: moment().locale("ID").format("YYYY-MM-DD"),
      garansi_id: row.id,
      nama: row.nama.toUpperCase(),
      frame: row.frame.toUpperCase(),
      lensa: row.lensa.toUpperCase(),
    });
    setCrud((state) => ({ ...crudState, klaim: true }));
  };

  const garansiIsExpired = async (expiredDate) => {
    let a = moment(expiredDate);
    let b = moment().locale("ID");
    return b.isAfter(a); // True = expired, False = Active
  };

  const garansiStatus = async (isGaransi, garansiExpired, isClaimed) => {
    let status;
    if (!isGaransi) {
      status = "Non-Garansi";
    } else {
      if (garansiExpired) {
        status = "Expired";
      } else {
        if (isClaimed) {
          status = "Claimed";
        } else {
          status = "Active";
        }
      }
    }

    return status;
  };

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
      conditionalCellStyles: [
        {
          when: (row) => row.garansi_lensa !== "-" && row.claimed_lensa == 0,
          style: {
            backgroundColor: "#6610f2",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Frame",
      selector: (row) => row.frame.toUpperCase(),
      sortable: true,
      conditionalCellStyles: [
        {
          when: (row) => row.garansi_frame !== "-" && row.claimed_frame == 0,
          style: {
            backgroundColor: "#6610f2",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Button
            variant="link"
            className="p-0 me-3 text-success"
            onClick={() => showEdit(row)}
          >
            <FontAwesomeIcon icon={faHandHoldingMedical} />
          </Button>
          <Button
            variant="link"
            className="p-0 me-2 text-info"
            onClick={() => showDetail(row)}
          >
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
    setCrud((state) => ({ ...crudState, show: true }));
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
          {crud.show === true && (
            <>
              <Row>
                <Col md={3} sm={12} className="mb-1">
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
                <span
                  style={{ fontSize: "12px" }}
                  className="text-muted mb-2 mt-0"
                >
                  <FontAwesomeIcon
                    icon={faSquare}
                    className="me-1 ms-3"
                    style={{ color: "#6610f2" }}
                  />
                  Sudah diklaim garansi
                </span>
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
                          <td className="fw-semibold">Optik</td>
                          <td>:</td>
                          <td>{detail.nama_optik}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Frame</td>
                          <td>:</td>
                          <td>{detail.frame} </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Lensa</td>
                          <td>:</td>
                          <td>{detail.lensa}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="fw-semibold text-center">
                            Garansi
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Lensa</td>
                          <td>:</td>
                          <td>
                            {detail.garansi_lensa}
                            {detail.garansi_lensa === "-"
                              ? ""
                              : detail.garansi_lensa === "6"
                              ? " Bulan "
                              : " Tahun "}
                            {detail.status_lensa === "Non-Garansi" ? (
                              <Badge bg="secondary">Non-Garansi</Badge>
                            ) : detail.status_lensa === "Expired" ? (
                              <Badge bg="danger">Expired</Badge>
                            ) : detail.status_lensa === "Claimed" ? (
                              <Badge bg="primary">Claimed</Badge>
                            ) : (
                              <Badge bg="success">Active</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-light text-end">Exp</td>
                          <td>:</td>
                          <td>{detail.expired_lensa}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Frame</td>
                          <td>:</td>
                          <td>
                            {detail.garansi_frame}
                            {detail.garansi_frame === "-"
                              ? ""
                              : detail.garansi_frame === "6"
                              ? " Bulan "
                              : " Tahun "}
                            {detail.status_frame === "Non-Garansi" ? (
                              <Badge bg="secondary">Non-Garansi</Badge>
                            ) : detail.status_frame === "Expired" ? (
                              <Badge bg="danger">Expired</Badge>
                            ) : detail.status_frame === "Claimed" ? (
                              <Badge bg="primary">Claimed</Badge>
                            ) : (
                              <Badge bg="success">Active</Badge>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-light text-end">Exp</td>
                          <td>:</td>
                          <td>{detail.expired_frame}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="table table-sm table-bordered table-detail">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Sph</th>
                          <th>Cyl</th>
                          <th>Axis</th>
                          <th>Add</th>
                          <th>Mpd</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-bold">OD</td>
                          <td>{detail.r[0]}</td>
                          <td>{detail.r[1]}</td>
                          <td>{detail.r[2]}</td>
                          <td>{detail.r[3]}</td>
                          <td>{detail.r[4]}</td>
                        </tr>
                        <tr>
                          <td className="text-bold">OS</td>
                          <td>{detail.l[0]}</td>
                          <td>{detail.l[1]}</td>
                          <td>{detail.l[2]}</td>
                          <td>{detail.l[3]}</td>
                          <td>{detail.l[4]}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-center mt-1">Data Klaim Garansi</h6>
                    {detail.data_klaim.map((item, index) => (
                      <Card className="mb-1" key={index}>
                        <Card.Header className="py-1">
                          <h6>
                            {item.jenis_garansi == "lensa"
                              ? "Garansi Lensa"
                              : "Garansi Frame"}
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <table className="table table-sm table-detail mb-0">
                            <tbody>
                              <tr>
                                <td>Tanggal</td>
                                <td>:</td>
                                <td>
                                  {moment(item.tanggal).format("DD/MM/YYYY")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <span className="fw-semibold table-detail">
                            Kerusakan :
                          </span>
                          <Card className="border border-danger p-0 rounded-0">
                            <Card.Body
                              className="p-2 py-0"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {item.kerusakan}
                            </Card.Body>
                          </Card>
                          <span className="fw-semibold table-detail">
                            Perbaikan :
                          </span>
                          <Card className="border border-success p-0 rounded-0">
                            <Card.Body
                              className="p-2 py-0"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {item.perbaikan}
                            </Card.Body>
                          </Card>
                        </Card.Body>
                      </Card>
                    ))}
                  </Col>
                </Row>
              </LoadingOverlay>
            </>
          )}
          {crud.klaim === true && (
            <KlaimGaransi
              dataOptik={dataOptik}
              setCrud={setCrud}
              getData={getData}
              dataGaransi={dataGaransi}
            />
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

export default DataGaransi;
