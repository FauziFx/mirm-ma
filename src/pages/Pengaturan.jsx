import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import useDocumentTitle from "../utils/useDocumentTitle";
import axios from "axios";
import Swal from "sweetalert2";

function Pengaturan() {
  useDocumentTitle("Pengaturan");
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [user, setUser] = useState({
    id: "",
    nama: "",
    username: "",
    role: "",
    oldPassword: "",
    newPassword: "",
    id_optik: "",
  });

  const getData = async () => {
    try {
      const token = cookies.get("rm-ma-token");
      const decode = jwtDecode(token).user;
      setUser({
        id: decode.id,
        nama: decode.nama,
        username: decode.username,
        role: decode.role,
        oldPassword: "",
        newPassword: "",
        id_optik: decode.id_optik,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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
    try {
      e.preventDefault();
      const id = user.id;
      const response = await axios.put(
        API_URL + "change_password/" + id,
        {
          nama: user.nama,
          username: user.username,
          password_lama: user.oldPassword,
          password_baru: user.newPassword,
          role: user.role,
        },
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );
      if (response.data.success) {
        if (response.data.match === true) {
          Swal.fire({
            icon: "success",
            title: "Logout terlebih dahulu untuk melihat perubahan",
            showConfirmButton: false,
            timer: 1500,
          });
          getData();
        } else {
          Toast.fire({
            icon: "error",
            title: "Password Lama salah!!",
          });
        }
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Container className="page-container">
      <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">
        <div className="lh-1">
          <h1 className="h4 mb-0 text-white lh-1">Pengaturan</h1>
        </div>
      </div>
      <Card className="shadow">
        <Card.Body>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <span className="text-danger" style={{ fontSize: "12px" }}>
                * Wajib diisi!
              </span>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">
                    Nama<i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    className="border border-primary"
                    name="nama"
                    size="sm"
                    type="text"
                    placeholder="Nama"
                    required
                    value={user.nama}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">
                    Email<i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    className="border border-primary"
                    name="username"
                    size="sm"
                    type="email"
                    placeholder="Email"
                    required
                    value={user.username}
                    onChange={(e) => handleChange(e)}
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">
                    Password Lama<i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    className="border border-primary"
                    name="oldPassword"
                    size="sm"
                    type="password"
                    placeholder="*****"
                    required
                    value={user.oldPassword}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-0">
                    Password Lama<i className="text-danger">*</i>
                  </Form.Label>
                  <Form.Control
                    className="border border-primary"
                    name="newPassword"
                    size="sm"
                    type="password"
                    placeholder="*****"
                    minLength={5}
                    required
                    value={user.newPassword}
                    onChange={(e) => handleChange(e)}
                  />
                </Form.Group>
                <div className="text-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="me-1"
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" />
                    Simpan
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Pengaturan;
