import {
  faArrowLeft,
  faEdit,
  faFilterCircleXmark,
  faMagnifyingGlass,
  faSave,
  faSquarePlus,
  faStore,
  faTrashCan,
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
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import Cookies from "universal-cookie";
import useDocumentTitle from "../utils/useDocumentTitle";

function DataOptik() {
  useDocumentTitle("Data Optik");
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [search, setSearch] = useState("");

  // CRUD
  const crudState = {
    show: false,
    tambah: false,
    edit: false,
  };
  const [crud, setCrud] = useState(crudState);

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);

  const [namaOptik, setNamaOptik] = useState("");
  const [idOptik, setIdOptik] = useState("");

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "fit-content",
    },
    {
      name: "Nama Optik/Armada",
      selector: (row) => row.nama_optik.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Button
            variant="link"
            size="sm"
            className="text-success mr-1"
            onClick={() => showEdit(row)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-danger mr-1"
            onClick={() => confirmDelete(row.id, row.nama_optik)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        </>
      ),
      width: "auto",
    },
  ];

  const showEdit = (row) => {
    setNamaOptik(row.nama_optik);
    setIdOptik(row.id);
    setCrud((state) => ({ ...crudState, edit: true }));
  };

  const confirmDelete = (id, nama) => {
    Swal.fire({
      html: `<p class="mb-0">Apakah kamu mau menghapus <br/> <b class="text-uppercase">${nama}</b> ?</p>`,
      showCancelButton: true,
      confirmButtonText: "Hapus",
      confirmButtonColor: "#d33",
      cancelButtonText: "Batal",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        deleteOptik(id);
      }
    });
  };

  const deleteOptik = async (id) => {
    try {
      const response = await axios.delete(API_URL + "optik/" + id, {
        headers: {
          Authorization: cookies.get("rm-ma-token"),
        },
      });

      if (response.data.success) {
        getData();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_URL + "optik",
        {
          nama_optik: namaOptik,
        },
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );

      if (response.data.success) {
        setCrud((state) => ({ ...crudState, show: true }));
        getData();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      } else {
        setCrud((state) => ({ ...crudState, show: true }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        API_URL + "optik/" + idOptik,
        {
          nama_optik: namaOptik,
        },
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );

      if (response.data.success) {
        setCrud((state) => ({ ...crudState, show: true }));
        getData();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      } else {
        setCrud((state) => ({ ...crudState, show: true }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(API_URL + "optik");
      setData(response.data.data);
      setFilter(response.data.data);
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
      return item.nama_optik.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(filterSearch);
  }, [search]);

  return (
    <Container className="page-container">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">
        <div className="lh-1">
          <h1 className="h4 mb-0 text-white lh-1">Data Optik</h1>
        </div>
      </div>
      <Card className="mb-0 mt-2">
        <Card.Header>
          <Row>
            <Col md={6} sm={6} xs={6}>
              <h5 className="m-0">
                {crud.show === true
                  ? "Data"
                  : crud.tambah === true
                  ? "Tambah"
                  : "Edit"}
                &nbsp;Optik
              </h5>
            </Col>
            <Col md={6} sm={6} xs={6} className="text-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  {
                    crud.show === true
                      ? setCrud((state) => ({ ...crudState, tambah: true }))
                      : setCrud((state) => ({ ...crudState, show: true }));
                  }
                }}
              >
                {crud.show === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSquarePlus} /> Tambah Optik
                  </span>
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faStore} /> Data Optik
                  </span>
                )}
              </Button>
            </Col>
          </Row>
        </Card.Header>
      </Card>
      <Card className="shadow">
        <Card.Body>
          {crud.show === true && (
            <>
              <Row>
                <Col md={{ span: 4, offset: 8 }} sm={12}>
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
                        placeholder="Cari Nama optik Disini..."
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
                        <Badge bg="primary" className="fw-light me-1">
                          {search}
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
            </>
          )}
          {crud.tambah === true && (
            <>
              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      setCrud((state) => ({ ...crudState, show: true }))
                    }
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    Kembali
                  </Button>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Nama Optik<i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="nama_optik"
                        size="sm"
                        type="text"
                        placeholder="Nama Optik"
                        required
                        value={namaOptik}
                        onChange={(e) => setNamaOptik(e.target.value)}
                      />
                    </Form.Group>
                    <div className="text-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="me-1"
                        disabled={namaOptik.length === 0}
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Simpan
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </>
          )}
          {crud.edit === true && (
            <>
              <Row>
                <Col md={{ span: 6, offset: 3 }}>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      setCrud((state) => ({ ...crudState, show: true }))
                    }
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    Kembali
                  </Button>
                  <Form onSubmit={handleSubmitEdit}>
                    <Form.Group className="mb-2">
                      <Form.Label className="mb-0">
                        Nama Optik<i className="text-danger">*</i>
                      </Form.Label>
                      <Form.Control
                        className="border border-primary"
                        name="nama_optik"
                        size="sm"
                        type="text"
                        placeholder="Nama Optik"
                        required
                        value={namaOptik}
                        onChange={(e) => setNamaOptik(e.target.value)}
                      />
                    </Form.Group>
                    <div className="text-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="me-1"
                        disabled={namaOptik.length === 0}
                      >
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Simpan
                      </Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
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

export default DataOptik;
