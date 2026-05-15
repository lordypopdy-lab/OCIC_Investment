import React from "react";
import toast from "react-hot-toast";
import MainNavBar from "../components/MainNavBar";

const Deposite = () => {
  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied successfully!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };
  const walletConnect = async () => {
    toast.success("Wallet Connect Comming Soon!");
  };
  return (
    <>
      <MainNavBar />
      <div style={{ marginTop: "80px" }} className="container-scroller">
        <div className="container-fluid page-body-wrapper">
          <div className="main-panel m-0 w-100">
            <div
              className="content-wrapper"
              style={{ background: "#0a0f1f", padding: "10px" }}
            >
              <div className="row">
                {/* BTC / TRC20 */}
                <div className="col-xl-4 col-sm-4 p-2">
                  <button onClick={walletConnect} style={connectBtn}>
                    <i className="fas fa-wallet m-2"></i> Connect Wallet
                  </button>

                  <div style={cardStyle}>
                    <div className="card-body">
                      {/* WALLET */}
                      <div
                        onClick={() =>
                          handleCopy("142VM79zADHb85W9LwT7VrzqFmSPZhtHKu")
                        }
                        style={walletBox}
                      >
                        142VM79zADHb85W9LwT7VrzqFm...
                        <i
                          className="fas fa-copy"
                          style={{ marginLeft: "8px" }}
                        ></i>
                      </div>

                      <h5 style={titleStyle}>Bitcoin | USDT (TRC20)</h5>
                      <p style={subText}>Deposit Method</p>
                      <hr style={divider} />

                      <p style={descText}>
                        <span style={{ color: "gold" }}>
                          Upload proof for fast verification.
                        </span>{" "}
                        <span style={{ color: "#ccc" }}>
                          System auto-funds and notifies you instantly.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ETH / ERC20 */}
                <div className="col-xl-4 col-sm-4 p-2">
                  <button onClick={walletConnect} style={connectBtn}>
                    <i className="fas fa-wallet m-2"></i> Connect Wallet
                  </button>

                  <div style={cardStyle}>
                    <div className="card-body">
                      <div
                        onClick={() =>
                          handleCopy(
                            "0xaf8daae1cc72a8f9db1d096dec83cfec593fae87",
                          )
                        }
                        style={walletBox}
                      >
                        0xaf8daae1cc72a8f9db1d096d...
                        <i
                          className="fas fa-copy"
                          style={{ marginLeft: "8px" }}
                        ></i>
                      </div>

                      <h5 style={titleStyle}>Ethereum | USDT (ERC20)</h5>
                      <p style={subText}>Deposit Method</p>
                      <hr style={divider} />

                      <p style={descText}>
                        <span style={{ color: "gold" }}>
                          Upload proof for fast verification.
                        </span>{" "}
                        <span style={{ color: "#ccc" }}>
                          System auto-funds and notifies you instantly.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* USDT TRC20 */}
                <div className="col-xl-4 col-sm-4 p-2">
                  <div style={cardStyle}>
                    <div className="card-body">
                      <div
                        onClick={() =>
                          handleCopy("TRLxvLahTfr87wYZEgecHjfrJjtffUAvmy")
                        }
                        style={walletBox}
                      >
                        TRLxvLahTfr87wYZEgecHjfrJjtf....
                        <i
                          className="fas fa-copy"
                          style={{ marginLeft: "8px" }}
                        ></i>
                      </div>

                      <h5 style={titleStyle}>USDT (TRC20)</h5>
                      <p style={subText}>Alternative Deposit</p>
                      <hr style={divider} />

                      <p style={descText}>
                        <span style={{ color: "#00ffae" }}>
                          Request other payment methods.
                        </span>{" "}
                        <span style={{ color: "#ccc" }}>
                          Send proof to support after payment.
                        </span>
                      </p>
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

const cardStyle = {
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.95))",
  border: "1px solid rgba(255,215,0,0.1)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
};

const connectBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid rgba(255,215,0,0.2)",
  background: "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.9))",
  color: "gold",
  fontWeight: "600",
  marginBottom: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
};

const walletBox = {
  background: "rgba(255,215,0,0.08)",
  border: "1px solid rgba(255,215,0,0.2)",
  padding: "10px",
  borderRadius: "10px",
  color: "gold",
  cursor: "pointer",
  fontSize: "13px",
  marginBottom: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const titleStyle = {
  color: "#fff",
  fontWeight: "600",
};

const subText = {
  color: "gold",
  fontSize: "13px",
};

const descText = {
  fontSize: "13px",
  lineHeight: "1.6",
};

const divider = {
  borderColor: "rgba(255,215,0,0.2)",
};

export default Deposite;
