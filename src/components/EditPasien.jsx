import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "universal-cookie";

function EditPasien({ dataOptik, setCrud, dataPasien, getData }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const cookies = new Cookies();
  const [dataPribadi, setDataPribadi] = useState({});
  const list = [
    { name: "Hipertensi", check: false },
    { name: "Gula Darah", check: false },
    { name: "Kecelakaan", check: false },
    { name: "Operasi Mata", check: false },
    { name: "Katarak", check: false },
    { name: "Lainnya", check: false },
  ];
  const [checkItem, setCheckItem] = useState([
    ...list.map((x, id) => ({ id, ...x })),
  ]);

  // Swal Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const closeEditPasien = useCallback(() => {
    const crudState = {
      show: false,
      detail: false,
      edit: false,
      wa: false,
    };
    setCrud((state) => ({ ...crudState, show: true }));
  }, []);

  const handleChangeDP = (e) => {
    setDataPribadi((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const ttl =
      dataPribadi.tempat +
      ", " +
      moment(dataPribadi.tanggal_lahir).locale("id").format("DD MMMM YYYY");
    const data = {
      nama: dataPribadi.nama,
      alamat: dataPribadi.alamat,
      ttl: ttl,
      jenis_kelamin: dataPribadi.jenis_kelamin,
      pekerjaan: dataPribadi.pekerjaan,
      nohp: dataPribadi.nohp,
      riwayat: dataPribadi.riwayat,
      id_optik: dataPribadi.id_optik,
    };

    try {
      const response = await axios.put(
        API_URL + "pasien/" + dataPribadi.id,
        data,
        {
          headers: {
            Authorization: cookies.get("rm-ma-token"),
          },
        }
      );

      if (response.data.success === true) {
        getData();
        closeEditPasien();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(dataPasien);
    let date = new Date(dataPasien.ttl.split(",")[1]);
    setDataPribadi({
      id: dataPasien.id,
      nama: dataPasien.nama,
      alamat: dataPasien.alamat,
      tempat: dataPasien.ttl.split(",")[0],
      tanggal_lahir: moment(date).format("YYYY-MM-DD"),
      jenis_kelamin: dataPasien.jenis_kelamin,
      pekerjaan: dataPasien.pekerjaan,
      nohp: dataPasien.nohp,
      riwayat: dataPasien.riwayat,
      id_optik: dataPasien.id_optik,
    });
    const arr = dataPasien.riwayat.split(",");
    const result = checkItem.map((item) => {
      const found = arr.find((s) => s === item.name);
      if (found) {
        return { ...item, check: true };
      }
      return { ...item };
    });
    setCheckItem(result);
  }, []);

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="text-start">
          <Button variant="default" size="sm" onClick={() => closeEditPasien()}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Kembali
          </Button>
        </div>
        <h5 className="text-center">Edit Pasien</h5>
        <span className="text-danger" style={{ fontSize: "12px" }}>
          * Wajib Diisi
        </span>
        <Form id="form-data-pribadi" onSubmit={submitEdit} autoComplete="off">
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Nama Optik <i className="text-danger">*</i>
            </Form.Label>
            <Form.Select
              className="border border-primary"
              size="sm"
              name="id_optik"
              required
              value={dataPribadi.id_optik}
              onChange={(e) => handleChangeDP(e)}
            >
              <option hidden>Nama Optik</option>
              {dataOptik.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.nama_optik}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Nama <i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="nama"
              size="sm"
              type="text"
              placeholder="Nama Lengkap"
              required
              value={dataPribadi.nama}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Alamat <i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="alamat"
              as="textarea"
              row={2}
              placeholder="Alamat"
              required
              autoComplete="off"
              value={dataPribadi.alamat}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Tempat Lahir <i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="tempat"
              size="sm"
              type="text"
              placeholder="Tempat Lahir"
              required
              value={dataPribadi.tempat}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Tanggal Lahir <i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="tanggal_lahir"
              size="sm"
              type="date"
              placeholder="Tanggal Lahir"
              required
              value={dataPribadi.tanggal_lahir}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Jenis Kelamin <i className="text-danger">*</i>
            </Form.Label>
            <Form.Check
              type="radio"
              name="jenis_kelamin"
              label="Laki-laki"
              id="radio1"
              value="Laki-laki"
              checked={dataPribadi.jenis_kelamin === "Laki-laki"}
              onChange={(e) => handleChangeDP(e)}
            />
            <Form.Check
              type="radio"
              name="jenis_kelamin"
              label="Perempuan"
              id="radio2"
              value="Perempuan"
              checked={dataPribadi.jenis_kelamin === "Perempuan"}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              Pekerjaan <i className="text-danger">*</i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="pekerjaan"
              size="sm"
              type="text"
              placeholder="Pekerjaan"
              required
              value={dataPribadi.pekerjaan}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">
              No Hp &nbsp;
              <i className="text-danger" style={{ fontSize: "12px" }}>
                Isi &quot;0&quot; jika tidak ada
              </i>
            </Form.Label>
            <Form.Control
              className="border border-primary"
              name="nohp"
              size="sm"
              type="number"
              placeholder="08xxxx"
              required
              autoComplete="off"
              value={dataPribadi.nohp}
              onChange={(e) => handleChangeDP(e)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="mb-0">Riwayat Penyakit</Form.Label>
            {checkItem.map((item, i) => {
              return (
                <Form.Check
                  key={i}
                  type="checkbox"
                  label={item.name}
                  value={item.name}
                  id={"check" + item.id}
                  onChange={(e) => {
                    const curr = checkItem;
                    curr[item.id].check = !curr[item.id].check;
                    setCheckItem([...curr]);
                    const arr = curr
                      .filter(function (item) {
                        return item.check == true;
                      })
                      .map((items) => {
                        return items.name;
                      });
                    setDataPribadi((prevState) => ({
                      ...prevState,
                      riwayat: arr.toString(),
                    }));
                  }}
                  checked={item.check}
                />
              );
            })}
          </Form.Group>
          <div className="text-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="me-1"
              //   disabled={
              //     dataPribadi.nama.length === 0 ||
              //     dataPribadi.alamat.length === 0 ||
              //     dataPribadi.tempat.length === 0 ||
              //     dataPribadi.tanggal_lahir.length === 0 ||
              //     dataPribadi.jenis_kelamin.length === 0 ||
              //     dataPribadi.pekerjaan.length === 0 ||
              //     dataPribadi.nohp.length === 0 ||
              //     dataPribadi.id_optik.length === 0
              //   }
            >
              <FontAwesomeIcon icon={faSave} className="me-1" />
              Simpan
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default EditPasien;
