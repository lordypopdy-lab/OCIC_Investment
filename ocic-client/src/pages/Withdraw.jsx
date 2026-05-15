import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import MainNavBar from "../components/MainNavBar";
import FadeLoader from "react-spinners/FadeLoader";

const Withdraw = () => {
  const [user, setUser] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [bankR, setBankR] = useState([]);
  const [isNotification, setNotification] = useState("");
  const [cryptoR, setcryptoR] = useState([]);
  const [dataCrypto, setdataCrypto] = useState({
    value: "",
    walletAddress: "",
  });
  const [data, setData] = useState({
    value: 0,
    bank_name: "",
    account_name: "",
    account_number: "",
    swift_code: "",
  });

  useEffect(() => {
    const localStore = JSON.parse(localStorage.getItem("user"));
    const email = localStore.email;
    const ID = localStore._id;

    const getNotification = async () => {
      await axios.post("/getMessage", { ID }).then((data) => {
        if (data.data.submitMessage) {
          console.log(data.data.submitMessage);
          setNotification(data.data.submitMessage);
        }
      });
    };
    const getCryptoRecords = async () => {
      await axios.post("/getCryptoRecords", { email }).then((data) => {
        if (data) {
          setcryptoR(data.data);
        }
      });
    };
    const getBankRecords = async () => {
      await axios.post("/getBankRecords", { email }).then((data) => {
        if (data) {
          setBankR(data.data);
        }
      });
    };
    const getUser = async () => {
      const localStore = JSON.parse(localStorage.getItem("user"));
      setUser(localStore);
    };
    getUser();
    getBankRecords();
    getCryptoRecords();
    getNotification();
  }, []);

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied successfully!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const bankWithdraw = async () => {
    setLoading1(true);
    const email = user.email;
    const { value, bank_name, account_name, account_number, swift_code } = data;

    try {
      await axios
        .post("/withdrawBank", {
          email,
          value,
          bank_name,
          account_name,
          account_number,
          swift_code,
        })
        .then((data) => {
          if (data.data.success) {
            toast.success(data.data.success);
            setLoading1(false);
            setData({
              value: 0,
              bank_name: "",
              account_name: "",
              account_number: "",
              swift_code: "",
            });
          } else if (data.data.error) {
            setLoading1(false);
            toast.error(data.data.error);
          }
        });
    } catch (error) {
      console.log("Withrawal failed: ", error);
    }
  };

  const cyptoWithrawal = async (e) => {
    e.preventDefault();
    setLoading2(true);
    const email = user.email;
    const { value, walletAddress } = dataCrypto;

    try {
      await axios
        .post("/withdrawCrypto", {
          email,
          value,
          walletAddress,
        })
        .then((data) => {
          if (data.data.success) {
            toast.success(data.data.success);
            setLoading2(false);
            setdataCrypto({
              value: "",
              walletAddress: "",
            });
          } else if (data.data.error) {
            toast.error(data.data.error);
            setLoading2(false);
          }
        });
    } catch (error) {
      console.log("Crypto withdrawal failed: ", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleWithdraw = async () => {
    bankWithdraw();
  };
  return (
    <>
      <MainNavBar />
      <Modal className="mt-4" show={show} onHide={handleClose}>
        <Modal.Header className="bg-dark" closeButton>
          <Modal.Title>Warning!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark modal-body-scroll">
          {isNotification !== "" ? (
            <div className="card-title text-warning mb-5">{isNotification}</div>
          ) : (
            <div className="card-title text-warning mb-5">
              Are you Sure you want to Approve This Transaction?
            </div>
          )}
          <Button
            variant="primary"
            style={{ height: "auto", padding: "8px", width: "160px" }}
            disabled={isLoading}
            onClick={!isLoading ? handleWithdraw : null}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button
            style={{ padding: "8px", width: "120px" }}
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ marginTop: "80px" }} className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          <div className="main-panel m-0 w-100">
            <div className="content-wrapper">
              <div
                className="row"
                style={{ background: "#0a0f1f", padding: "10px" }}
              >
                {/* LEFT PANEL */}
                <div className="col-xl-6 col-sm-6 p-2">
                  {/* CONNECT WALLET */}
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,215,0,0.2)",
                      background:
                        "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.9))",
                      color: "gold",
                      fontWeight: "600",
                      marginBottom: "15px",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                    }}
                  >
                    <i className="fas fa-wallet m-2"></i> Connect Wallet
                  </button>

                  {/* CARD */}
                  <div
                    style={{
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.95))",
                      border: "1px solid rgba(255,215,0,0.1)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="card-body">
                      <h4 style={{ color: "#fff", fontWeight: "600" }}>
                        Withdraw
                      </h4>
                      <p style={{ color: "gold", fontSize: "13px" }}>
                        Secure withdrawal details
                      </p>

                      <h6
                        onClick={() => handleCopy(user._id)}
                        style={{
                          color: "#aaa",
                          cursor: "pointer",
                          marginTop: "15px",
                        }}
                      >
                        ID: {user._id}
                        <i
                          className="fas fa-copy m-2"
                          style={{ color: "gold" }}
                        ></i>
                      </h6>

                      <FadeLoader
                        color="gold"
                        loading={loading1}
                        speedMultiplier={3}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "45%",
                          zIndex: 1,
                        }}
                      />

                      <form className="forms-sample">
                        <div className="form-group">
                          <label style={{ color: "gold" }}>
                            Amount {user.currency}
                          </label>
                          <input
                            type="number"
                            value={data.value}
                            onChange={(e) =>
                              setData({ ...data, value: e.target.value })
                            }
                            placeholder="$value"
                            style={inputStyle}
                          />

                          <label style={labelStyle}>Bank Name</label>
                          <input
                            value={data.bank_name}
                            onChange={(e) =>
                              setData({ ...data, bank_name: e.target.value })
                            }
                            style={inputStyle}
                            placeholder="Bank name"
                          />

                          <label style={labelStyle}>Account Name</label>
                          <input
                            value={data.account_name}
                            onChange={(e) =>
                              setData({ ...data, account_name: e.target.value })
                            }
                            style={inputStyle}
                            placeholder="Account name"
                          />

                          <label style={labelStyle}>Account Number</label>
                          <input
                            type="number"
                            value={data.account_number}
                            onChange={(e) =>
                              setData({
                                ...data,
                                account_number: e.target.value,
                              })
                            }
                            style={inputStyle}
                            placeholder="Account number"
                          />

                          <label style={labelStyle}>Swift Code</label>
                          <input
                            value={data.swift_code}
                            onChange={(e) =>
                              setData({ ...data, swift_code: e.target.value })
                            }
                            style={inputStyle}
                            placeholder="Swift code"
                          />
                        </div>

                        <div className="mt-3 d-flex justify-content-between">
                          <button
                            onClick={handleShow}
                            type="button"
                            style={primaryBtn}
                          >
                            Withdraw <i className="fas fa-arrow-down m-1"></i>
                          </button>

                          <button style={secondaryBtn}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="col-xl-6 col-sm-6 mt-3">
                  <div
                    style={{
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.95))",
                      border: "1px solid rgba(255,215,0,0.1)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div className="card-body">
                      <h4 style={{ color: "#fff", fontWeight: "600" }}>
                        Crypto Withdraw
                      </h4>

                      <p style={{ color: "gold", fontSize: "13px" }}>
                        Bitcoin | USDT (TRC20)
                      </p>

                      <h6
                        onClick={() => handleCopy(user._id)}
                        style={{ color: "#aaa", cursor: "pointer" }}
                      >
                        ID: {user._id}
                        <i
                          className="fas fa-copy m-2"
                          style={{ color: "gold" }}
                        ></i>
                      </h6>

                      <p style={{ fontSize: "12px", marginTop: "10px" }}>
                        <span style={{ color: "gold" }}>
                          Upload proof for fast verification.
                        </span>{" "}
                        <span style={{ color: "#ccc" }}>
                          System auto-credits and notifies you.
                        </span>
                      </p>

                      <form onSubmit={cyptoWithrawal}>
                        <label style={labelStyle}>Amount {user.currency}</label>
                        <input
                          type="number"
                          value={dataCrypto.value}
                          onChange={(e) =>
                            setdataCrypto({
                              ...dataCrypto,
                              value: e.target.value,
                            })
                          }
                          style={inputStyle}
                        />

                        <FadeLoader
                          color="gold"
                          loading={loading2}
                          speedMultiplier={3}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "45%",
                          }}
                        />

                        <label style={labelStyle}>Wallet Address (ERC20)</label>
                        <input
                          value={dataCrypto.walletAddress}
                          onChange={(e) =>
                            setdataCrypto({
                              ...dataCrypto,
                              walletAddress: e.target.value,
                            })
                          }
                          style={inputStyle}
                          placeholder="Wallet address..."
                        />

                        <div className="mt-3 d-flex justify-content-between">
                          <button type="submit" style={primaryBtn}>
                            Withdraw <i className="fas fa-arrow-down m-1"></i>
                          </button>

                          <button style={secondaryBtn}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ background: "#0a0f1f" }}>
                {/* BANK RECORDS */}
                <div className="col-md-12 mt-2 p-2">
                  <div
                    style={{
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.95))",
                      border: "1px solid rgba(255,215,0,0.1)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                      padding: "15px",
                    }}
                  >
                    <h4
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      Bank Withdrawal Records
                    </h4>
                    <hr style={{ borderColor: "rgba(255,215,0,0.2)" }} />

                    {/* SCROLLABLE TABLE */}
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        overflowX: "auto",
                        borderRadius: "10px",
                      }}
                    >
                      <table style={tableStyle}>
                        <thead style={theadStyle}>
                          <tr>
                            <th>[#]</th>
                            <th>[Amount]</th>
                            <th>[Bank]</th>
                            <th>[Name]</th>
                            <th>[Swift]</th>
                            <th>[Status]</th>
                            <th>[Email]</th>
                          </tr>
                        </thead>

                        <tbody>
                          {bankR.length > 0 ? (
                            bankR.map((data) => (
                              <tr key={data._id} style={rowStyle}>
                                <td>ID{data._id.slice(1, 10)}</td>
                                <td>
                                  {user.currency}
                                  {data.amount}
                                </td>
                                <td>{data.bank}</td>
                                <td>{data.name}</td>
                                <td>{data.swiftCode}</td>
                                <td style={{ color: "gold" }}>{data.status}</td>
                                <td>{data.email}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" style={emptyStyle}>
                                No Records Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* CRYPTO RECORDS */}
                <div className="col-md-12 mt-2 p-2">
                  <div
                    style={{
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.95))",
                      border: "1px solid rgba(255,215,0,0.1)",
                      boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
                      padding: "15px",
                    }}
                  >
                    <h4
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "600",
                      }}
                    >
                      Crypto Withdrawal Records
                    </h4>
                    <hr style={{ borderColor: "rgba(255,215,0,0.2)" }} />

                    {/* SCROLLABLE TABLE */}
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        overflowX: "auto",
                        borderRadius: "10px",
                      }}
                    >
                      <table style={tableStyle}>
                        <thead style={theadStyle}>
                          <tr>
                            <th>[#]</th>
                            <th>[Amount]</th>
                            <th>[Wallet]</th>
                            <th>[Status]</th>
                            <th>[Email]</th>
                          </tr>
                        </thead>

                        <tbody>
                          {cryptoR.length > 0 ? (
                            cryptoR.map((data) => (
                              <tr key={data._id} style={rowStyle}>
                                <td>ID{data._id.slice(1, 10)}</td>
                                <td>
                                  {user.currency}
                                  {data.amount}
                                </td>
                                <td
                                  onClick={() => handleCopy(data.cryptoAddress)}
                                  style={{ cursor: "pointer", color: "gold" }}
                                >
                                  {data.cryptoAddress.slice(1, 10)}...
                                </td>
                                <td style={{ color: "gold" }}>{data.status}</td>
                                <td>{data.email}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" style={emptyStyle}>
                                No Records Available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


/* 🔥 STYLES */
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#eaeaea",
  fontSize: "13px",
};

const theadStyle = {
  position: "sticky",
  top: 0,
  background: "#0f172a",
  color: "gold",
  zIndex: 2,
};

const rowStyle = {
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const emptyStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#aaa",
};

/* 🔥 REUSABLE STYLES */
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1px solid rgba(255,215,0,0.15)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  outline: "none",
};

const labelStyle = {
  marginTop: "12px",
  color: "gold",
  fontSize: "13px",
};

const primaryBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg, #FFD700, #C9A000)",
  color: "#000",
  fontWeight: "600",
  boxShadow: "0 4px 15px rgba(255,215,0,0.4)",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid rgba(255,215,0,0.2)",
  background: "transparent",
  color: "#ccc",
  cursor: "pointer",
};

export default Withdraw;
