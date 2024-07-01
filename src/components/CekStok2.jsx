import {
  faArrowLeft,
  faCaretRight,
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
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Cookies from "universal-cookie";

function CekStok2() {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [src, setSrc] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API_URL + "stok",
        {
          power: search,
        },
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );
      if (response.data.success) {
        setSrc(true);
        setData(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const columns = [
    {
      name: "Nama Lensa",
      selector: (row) => (
        <>
          {row.nama}{" "}
          <span className="ms-1 d-block mb-2 fw-semibold">
            {row.nama_varian}
          </span>
        </>
      ),
      wrap: true,
    },
    {
      name: "Stok",
      selector: (row) => row.stok,
      width: "fit-content",
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
  return (
    <Card className="shadow">
      <Card.Body>
        <>
          <Row>
            <Col md={{ span: 5, offset: 7 }}>
              <div className="search-box d-inline">
                <Form onSubmit={handleSubmit}>
                  <InputGroup className="mb-2">
                    <FormControl
                      className="border border-primary"
                      type="text"
                      size="sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari Ukuran lensa Disini..."
                    />
                    <InputGroup.Text
                      id="search-data"
                      className="p-0 border border-primary"
                    >
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        className="rounded-0 rounded-end"
                      >
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </Button>
                    </InputGroup.Text>
                  </InputGroup>
                </Form>
              </div>
            </Col>
          </Row>
          <Row>
            <ButtonToolbar className="mb-2">
              {src && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSrc("");
                      setSearch("");
                    }}
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
          {!src ? (
            <>
              <ul className="text-secondary table-detail">
                <h6 className="text-dark mb-0">Mau Cari Lensa Jenis Apa ?</h6>
                <h6 className="text-dark">Ini contoh caranya!!</h6>
                <li>
                  Kalau mau cari lensa SV ketik
                  <pre className="text-dark fw-semibold d-inline p-0 mx-1">
                    &quot;SV -025&quot;
                  </pre>
                  atau{" "}
                  <pre className="text-dark fw-semibold d-inline p-0">
                    &quot;-025&quot;
                  </pre>
                </li>
                <li>
                  Kalau mau cari lensa CYL ketik
                  <pre className="text-dark fw-semibold d-inline p-0 mx-1">
                    &quot;CYL -025-025&quot;
                  </pre>
                  atau{" "}
                  <pre className="text-dark fw-semibold d-inline p-0">
                    &quot;-025-025&quot;
                  </pre>
                </li>
                <li>
                  Kalau mau cari lensa KRIPTOK ketik
                  <pre className="text-dark fw-semibold d-inline p-0 mx-1">
                    &quot;KT -025/+200&quot;
                  </pre>
                  atau{" "}
                  <pre className="text-dark fw-semibold d-inline p-0">
                    &quot;-025/+200&quot;
                  </pre>
                </li>
                <li>
                  Kalau mau cari lensa PROGRESSIVE ketik
                  <pre className="text-dark fw-semibold d-inline p-0 mx-1">
                    &quot;-025/+200&quot;
                  </pre>
                </li>
                <li>
                  Gak usah pake tanda petik{" "}
                  <pre className="text-dark fw-bold d-inline">&quot;&quot;</pre>
                </li>
              </ul>
            </>
          ) : (
            <>
              <DataTable
                className="mw-100"
                columns={columns}
                data={data}
                customStyles={tableCustomStyles}
              />
            </>
          )}
        </>
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

export default CekStok2;
