import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck, faMessage } from "@fortawesome/free-regular-svg-icons";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

function WaPasien({ dataWA, setCrud }) {
  const [pesan, setPesan] = useState({
    nama: dataWA.nama.toUpperCase(),
    nohp: dataWA.nohp,
    pesan: "",
  });
  const [terkirim, setTerkirim] = useState(false);
  const closeWaPasien = useCallback(() => {
    const crudState = {
      show: false,
      detail: false,
      edit: false,
      wa: false,
    };
    setCrud((state) => ({ ...crudState, show: true }));
  }, []);

  const handleChangePesan = (e) => {
    setPesan((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitPesan = (e) => {
    e.preventDefault();
    const nowa = "62" + pesan.nohp.substring(1);
    const pesanEncoded = encodeURI(pesan.pesan);
    console.log(nowa + "\n" + pesanEncoded);

    window.open(
      `https://wa.me/${nowa}?text=${pesanEncoded}`,
      "_blank",
      "noopener,noreferrer"
    );
    setTerkirim(true);
  };

  useEffect(() => {
    const jam = moment().tz("Asia/Jakarta").format("H");
    let msg;
    if (jam <= 10) {
      msg = `Assalaamu'alaikum, Selamat Pagi ${dataWA.nama.toUpperCase()}`;
    } else if (jam <= 14) {
      msg = `Assalaamu'alaikum, Selamat Siang ${dataWA.nama.toUpperCase()}`;
    } else if (jam <= 17) {
      msg = `Assalaamu'alaikum, Selamat Sore ${dataWA.nama.toUpperCase()}`;
    } else {
      msg = `Assalaamu'alaikum, Selamat Malam ${dataWA.nama.toUpperCase()}`;
    }

    setPesan((prev) => ({ ...prev, pesan: msg }));
  }, []);

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        <div className="text-start">
          <Button variant="default" size="sm" onClick={() => closeWaPasien()}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Kembali
          </Button>
        </div>
        {terkirim ? (
          <>
            <div className="text-center mb-2">
              <FontAwesomeIcon
                icon={faCircleCheck}
                size="3x"
                className="text-success"
              />
              <br />
              <span className="fw-semibold">Pesan Terkirim</span>
            </div>
            <p
              style={{ fontFamily: "consolas", whiteSpace: "pre-wrap" }}
              className="text-muted"
            >
              Kepada: {pesan.nama} <br />[{moment().format("l LT")}] <br />
              {pesan.nohp} ~: {pesan.pesan}
            </p>
            <div className="text-center">
              <Button onClick={() => setTerkirim(false)}>
                <FontAwesomeIcon icon={faMessage} /> Kirim Pesan lagi
              </Button>
            </div>
          </>
        ) : (
          <>
            <h5 className="text-center">Hubungi Pasien</h5>
            <Form autoComplete="off" onSubmit={handleSubmitPesan}>
              <Row>
                <Col md={6}>
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
                      value={pesan.nama}
                      onChange={(e) => handleChangePesan(e)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label className="mb-0">
                      No Hp / WhatsApp <i className="text-danger">*</i>
                    </Form.Label>
                    <Form.Control
                      className="border border-primary"
                      name="nama"
                      size="sm"
                      type="number"
                      placeholder="No Hp / WhatsApp"
                      required
                      value={pesan.nohp}
                      onChange={(e) => handleChangePesan(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-2">
                <Form.Label className="mb-0">
                  Pesan <i className="text-danger">*</i>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  size="sm"
                  rows={6}
                  className="border border-primary"
                  name="pesan"
                  placeholder="Pesan"
                  required
                  value={pesan.pesan}
                  onChange={(e) => handleChangePesan(e)}
                />
              </Form.Group>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                * Pemberitahuan pengambilan kacamata <br />* Pemberitahuan
                pemeriksaan mata secara berkala <br />* Pemberitahuan lainnya
                <br />* Bebas apa aja
              </p>
              <div className="text-end">
                <Button type="submit" variant="success" className="text-end">
                  Kirim <FontAwesomeIcon icon={faWhatsapp} />
                </Button>
              </div>
            </Form>
          </>
        )}
      </Col>
    </Row>
  );
}

export default WaPasien;
