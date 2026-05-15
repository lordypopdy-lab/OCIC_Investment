import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Widget101 from "../components/Widget101";
import Widget102 from "../components/Widget102";
import MainNavBar from "../components/MainNavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState("");
  const [accountLevel, setAccountLevel] = useState("");
  const [isNotification, setNotification] = useState("");
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showKYCAlert, setShowKYCAlert] = useState(false);
  const [userVerification, setVerificationStatus] = useState({});

  const newU = localStorage.getItem("user");
  if (!newU) {
    window.location.href = "/login";
  }
  useEffect(() => {
    const newUser = JSON.parse(newU);
    const email = newUser.email;
    const ID = newUser._id;

    const getUserVerification = async () => {
      try {
        const response = await axios.post("/getUserVerification", { email });
        if (response.data.status === "success") {
          setVerificationStatus(response.data.data);
          if (response.data.data.kycStatus !== "verified") {
            setShowKYCAlert(true);
          }
        } else {
          setShowKYCAlert(true);
        }
      } catch (error) {
        console.error(error);
        setShowKYCAlert(true);
      }
    };

    const getAccountLevel = async () => {
      await axios.post("/getAccountLevel", { ID }).then((data) => {
        if (data.data.Level) {
          setAccountLevel(data.data.Level);
        }
      });
    };

    const getNotification = async () => {
      await axios.post("/getNotification", { ID }).then((data) => {
        if (data.data.notification) {
          setNotification(data.data.notification);
        }
      });
    };

    const getUser = async () => {
      await axios.post("/getUser", { email }).then((data) => {
        if (data) {
          setUser(data.data);
          const tBalance =
            data.data.deposit + data.data.profit + data.data.bonuse;
          setBalance(tBalance.toFixed(2));
        }
      });
    };
    getUser();
    getAccountLevel();
    getNotification();
    getUserVerification();
  }, []);
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };
  const handleSend = async () => {
    window.location.href = "/contact";
  };

  return (
    <>
      <MainNavBar />
      <div style={{ marginTop: "80px" }} className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          <div className="main-panel m-0 w-100">
            <div className="content-wrapper">
              <div className="text-center mb-4">
                <h5
                  className="fw-light mb-2"
                  style={{
                    fontSize: "1.5rem",
                    color: "#a1a1aa", // subtle light gray
                    letterSpacing: "1px",
                  }}
                >
                  Welcome back,
                </h5>
                <h3
                  className="fw-bold"
                  style={{
                    fontSize: "2rem",
                    color: "#10b981", // premium green accent
                    letterSpacing: "1px",
                    textShadow: "0 2px 6px rgba(0,0,0,0.3)", // subtle shadow for depth
                  }}
                >
                  {user?.name}!
                </h3>
                <p
                  className="mt-2"
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.9rem",
                    opacity: 0.85,
                  }}
                >
                  Here’s what’s happening with your account today
                </p>
              </div>
              <Widget102 />
              <Widget101 />
              <div className="row">
                {showKYCAlert && (
                  <div className="col-12 mb-3">
                    <div
                      className="card shadow-lg"
                      style={{
                        border: "none",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #ff4d4f 0%, #b71c1c 100%)",
                        color: "white",
                        padding: "1.5rem",
                      }}
                    >
                      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                        {/* Icon + Message */}
                        <div className="d-flex align-items-center mb-3 mb-md-0">
                          <div
                            className="d-flex justify-content-center align-items-center me-3"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.2)",
                              fontSize: "1.5rem",
                            }}
                          >
                            <i className="fas fa-exclamation-triangle"></i>
                          </div>
                          <div>
                            <h6
                              className="mb-1 fw-bold"
                              style={{ letterSpacing: "0.5px" }}
                            >
                              Verification Required
                            </h6>
                            <p className="mb-0" style={{ opacity: 0.85 }}>
                              Your account is not yet verified. Complete KYC to
                              unlock all features and secure your account.
                            </p>
                          </div>
                        </div>

                        {/* Button */}
                        <a
                          href="https://primevest-kyc.vercel.app"
                          className="btn d-flex align-items-center justify-content-center mt-3 mt-md-0"
                          style={{
                            background: "white",
                            color: "#b71c1c",
                            borderRadius: "12px",
                            fontWeight: 600,
                            padding: "0.6rem 1.2rem",
                            gap: "0.5rem",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                          }}
                        >
                          <i className="fas fa-id-card"></i>
                          Start Verification
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-xl-6 p-2 col-sm-6">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                      color: "white",
                      padding: "1rem",
                    }}
                  >
                    {/* Balance Display */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6
                          className="text-muted mb-1"
                          style={{ fontWeight: 400 }}
                        >
                          Current Balance
                        </h6>
                        <div className="d-flex align-items-center">
                          <h3 className="mb-0" style={{ fontWeight: 700 }}>
                            {isBalanceVisible ? (
                              <>
                                <span className="text-warning me-1">
                                  {user?.currency}
                                </span>
                                {balance.toLocaleString()}
                              </>
                            ) : (
                              "******"
                            )}
                          </h3>
                          <button
                            onClick={toggleBalanceVisibility}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              marginLeft: "12px",
                            }}
                            aria-label={
                              isBalanceVisible ? "Hide Balance" : "Show Balance"
                            }
                          >
                            <FontAwesomeIcon
                              icon={isBalanceVisible ? faEyeSlash : faEye}
                              className="text-warning"
                              size="lg"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Trend Icon */}
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "12px",
                          background: "rgba(255, 193, 7, 0.15)",
                        }}
                      >
                        <i className="fas fa-arrow-up text-warning"></i>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex flex-wrap justify-content-between mt-4 gap-2">
                      <a
                        href="/deposite"
                        className="btn flex-fill d-flex align-items-center justify-content-center"
                        style={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          color: "white",
                          fontWeight: 600,
                          gap: "8px",
                          padding: "0.5rem 0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <i className="fas fa-wallet text-warning p-2 bg-dark rounded-circle"></i>
                        Deposit
                      </a>

                      <a
                        href="/withdraw"
                        className="btn flex-fill d-flex align-items-center justify-content-center"
                        style={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          color: "white",
                          fontWeight: 600,
                          gap: "8px",
                          padding: "0.5rem 0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <i className="fas fa-paper-plane text-warning p-2 bg-dark rounded-circle"></i>
                        Withdraw
                      </a>

                      <a
                        href="/buy"
                        className="btn flex-fill d-flex align-items-center justify-content-center"
                        style={{
                          background: "#0f172a",
                          borderRadius: "12px",
                          color: "white",
                          fontWeight: 600,
                          gap: "8px",
                          padding: "0.5rem 0",
                          fontSize: "0.85rem",
                        }}
                      >
                        <i className="fas fa-credit-card text-warning p-2 bg-dark rounded-circle"></i>
                        Buy Assets
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-sm-6 grid-margin mt-3">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "white",
                      padding: "1rem",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Left: Balance Info */}
                      <div>
                        <h6
                          className="text-muted mb-1"
                          style={{ fontWeight: 400 }}
                        >
                          Bonus
                        </h6>
                        <div className="d-flex align-items-center">
                          <h3 className="mb-0" style={{ fontWeight: 700 }}>
                            {isBalanceVisible ? (
                              <>
                                <span className="text-warning me-1">
                                  {user?.currency}
                                </span>
                                {user?.bonuse?.toLocaleString()}.00
                              </>
                            ) : (
                              "******"
                            )}
                          </h3>
                          <p
                            className="text-warning mb-0 ms-3"
                            style={{ fontWeight: 500 }}
                          >
                            +18%
                          </p>
                        </div>
                      </div>

                      {/* Right: Get Started Button */}
                      <button
                        className="btn"
                        style={{
                          background: "#facc15",
                          color: "#0f172a",
                          fontWeight: 600,
                          borderRadius: "12px",
                          padding: "0.7rem 1.2rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          transition: "transform 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "translateY(-2px)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
                      >
                        Get Started <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>

                    {/* Trend Icon */}
                    <div
                      className="mt-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        background: "rgba(250, 204, 21, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span className="mdi mdi-arrow-top-right text-warning"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/* Total Profits Card */}
                <div className="col-md-6 grid-margin mt-3">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "white",
                      padding: "1.5rem",
                    }}
                  >
                    <h6
                      className="text-muted mb-2"
                      style={{ fontWeight: 400, letterSpacing: "0.5px" }}
                    >
                      Total Profits
                    </h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <h3 className="mb-0" style={{ fontWeight: 700 }}>
                        {isBalanceVisible ? (
                          <>
                            <span className="text-warning me-1">
                              {user?.currency}
                            </span>
                            {user?.profit?.toLocaleString()}.00
                          </>
                        ) : (
                          "******"
                        )}
                      </h3>
                      <p
                        className="text-warning mb-0"
                        style={{ fontWeight: 500 }}
                      >
                        +28%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Deposit Card */}
                <div className="col-md-6 grid-margin mt-3">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "white",
                      padding: "1.5rem",
                    }}
                  >
                    <h6
                      className="text-muted mb-2"
                      style={{ fontWeight: 400, letterSpacing: "0.5px" }}
                    >
                      Total Deposit
                    </h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <h3 className="mb-0" style={{ fontWeight: 700 }}>
                        {isBalanceVisible ? (
                          <>
                            <span className="text-warning me-1">
                              {user?.currency}
                            </span>
                            {user?.deposit?.toLocaleString()}.00
                          </>
                        ) : (
                          "******"
                        )}
                      </h3>
                      <p
                        className="text-warning mb-0"
                        style={{ fontWeight: 500 }}
                      >
                        +68%
                      </p>
                    </div>
                  </div>
                </div>
                {accountLevel !== "" ? (
                  <div className="col-md-12 grid-margin mt-3">
                    <div
                      className="card shadow-lg"
                      style={{
                        border: "none",
                        borderRadius: "16px",
                        background:
                          "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                        color: "white",
                        padding: "1.5rem",
                      }}
                    >
                      <div className="row align-items-center">
                        {/* Medal / Level Icon */}
                        <div className="col-md-2 d-flex justify-content-center">
                          {accountLevel.accountLevel === "Level One" && (
                            <img
                              src="/img/medal1.png"
                              alt="Level One"
                              width={80}
                            />
                          )}
                          {accountLevel.accountLevel === "Level Two" && (
                            <img
                              src="/img/medal2.png"
                              alt="Level Two"
                              width={80}
                            />
                          )}
                          {accountLevel.accountLevel === "Level Three" && (
                            <img
                              src="/img/medal3.png"
                              alt="Level Three"
                              width={80}
                            />
                          )}
                        </div>

                        {/* Account Details */}
                        <div className="col-md-10">
                          <h5
                            className="fw-bold mb-2"
                            style={{ letterSpacing: "0.5px" }}
                          >
                            Account Level
                          </h5>
                          <p
                            style={{
                              fontSize: "1rem",
                              lineHeight: "1.5",
                              opacity: 0.85,
                            }}
                          >
                            Congratulations{" "}
                            <span className="text-success">{user?.name}</span>,
                            your account is currently at{" "}
                            {accountLevel.accountLevel === "Level One" && (
                              <span className="badge bg-success rounded-pill ms-1">
                                Level One
                              </span>
                            )}
                            {accountLevel.accountLevel === "Level Two" && (
                              <span className="badge bg-warning rounded-pill text-dark ms-1">
                                Level Two
                              </span>
                            )}
                            {accountLevel.accountLevel === "Level Three" && (
                              <span className="badge bg-primary rounded-pill ms-1">
                                Level Three
                              </span>
                            )}
                          </p>
                          <div
                            className="progress mt-2"
                            style={{ height: "8px", borderRadius: "8px" }}
                          >
                            <div
                              className={`progress-bar ${
                                accountLevel.accountLevel === "Level One"
                                  ? "bg-success"
                                  : accountLevel.accountLevel === "Level Two"
                                    ? "bg-warning"
                                    : "bg-primary"
                              }`}
                              role="progressbar"
                              style={{
                                width:
                                  accountLevel.accountLevel === "Level One"
                                    ? "33%"
                                    : accountLevel.accountLevel === "Level Two"
                                      ? "66%"
                                      : "100%",
                              }}
                              aria-valuenow={
                                accountLevel.accountLevel === "Level One"
                                  ? 33
                                  : accountLevel.accountLevel === "Level Two"
                                    ? 66
                                    : 100
                              }
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <div className="col-md-12 grid-margin mt-2 p-2">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "white",
                      padding: "1.5rem",
                    }}
                  >
                    <h5
                      className="fw-bold mb-3"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      Account Overview
                    </h5>

                    <div className="table-responsive">
                      <table
                        className="table table-hover mb-0"
                        style={{ color: "white" }}
                      >
                        <tbody>
                          <tr>
                            <td className="fw-medium text-warning">
                              Package{" "}
                              <i className="mdi mdi-security text-danger ms-1"></i>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-warning text-dark px-3 py-1 rounded-pill">
                                Pending
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium text-warning">
                              Signal{" "}
                              <i className="mdi mdi-signal-variant text-danger ms-1"></i>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-secondary px-3 py-1 rounded-pill">
                                None
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium text-warning">
                              Total Referrals{" "}
                              <i className="mdi mdi-account-multiple-plus text-danger ms-1"></i>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-secondary px-3 py-1 rounded-pill">
                                None
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium text-warning">
                              Account Type{" "}
                              <i className="mdi mdi-account-check text-danger ms-1"></i>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-info text-dark px-3 py-1 rounded-pill">
                                {user?.account_type || "Standard"}
                              </span>
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-medium text-warning">
                              Account Status{" "}
                              <i className="mdi mdi-shield text-danger ms-1"></i>
                            </td>
                            <td className="text-end">
                              <span className="badge bg-success px-3 py-1 rounded-pill">
                                Verified
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 grid-margin mt-3">
                  <div
                    className="card shadow-lg"
                    style={{
                      border: "none",
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                      color: "white",
                      padding: "1.5rem",
                    }}
                  >
                    {/* Live Chat Header */}
                    <div className="d-flex align-items-center mb-3">
                      {/* Red Pulse Circle BEFORE the text */}
                      <span
                        className="live-icon me-2"
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: "red",
                          display: "inline-block",
                          animation: "pulse 1.5s infinite",
                        }}
                      ></span>
                      <h5
                        className="fw-bold text-success mb-0"
                        style={{ marginLeft: "16px" }}
                      >
                        Live Chat
                      </h5>
                    </div>

                    {/* Message Input */}
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control"
                        style={{
                          borderRadius: "12px",
                          padding: "12px 16px",
                          background: "#1e293b",
                          border: "1px solid #374151",
                          color: "white",
                          flex: 1,
                        }}
                      />
                      <button
                        onClick={handleSend}
                        style={{
                          borderRadius: "12px",
                          background: "#10b981",
                          border: "none",
                          padding: "10px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#059669")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#10b981")
                        }
                      >
                        <i className="fas fa-paper-plane text-white"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{marginBottom: "20px"}} className="col-md-12 grid-margin mt-3">
                  <div
                    className="p-4"
                    style={{
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                      color: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Header */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h4 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <i className="fas fa-bell text-warning"></i>
                        Notification
                      </h4>
                      <i className="fas fa-envelope-open-text text-info"></i>
                    </div>

                    {/* Message Box */}
                    <div
                      className="p-3"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        minHeight: "60px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                        opacity: 0.9,
                      }}
                    >
                      {isNotification || "No new notifications"}
                    </div>
                  </div>
                </div>

                <style>
                  {`
  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 0.7; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.9); opacity: 0.7; }
  }
`}
                </style>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
