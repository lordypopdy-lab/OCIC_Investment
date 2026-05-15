import React from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import FadeLoader from "react-spinners/FadeLoader";

const Verification = () => {
  // if (!localStorage.getItem('email')) { location.href = '/login'; }

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", otp: "" });

  const getCode = async () => {
    setLoading(true);
    const { email } = data;
    await axios.post("/getOTP", { email }).then((data) => {
      if (data.data.OTP) {
        setLoading(false);
        setSent(true);
        toast.success(data.data.message);
        console.log("Success OTP:", data.data);
      } else if (data.data.error) {
        setLoading(false);
        toast.error(data.data.error);
        console.log(data.data.error);
      }
    });
    console.log("Getting Code...");
  };

  const verifyCode = async () => {
    setLoading(true);
    const { otp } = data;
    await axios.post("/verifyOtp", { otp }).then((data) => {
      if (data.data.success) {
        setLoading(false);
        setData({ otp: "" });
        console.log(data.data);
        toast.success(data.data.success);
      } else if (data.data.error) {
        setLoading(false);
        setData({ otp: "" });
        toast.error(data.data.error);
      }
    });
  };
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <a href="https://ocicinvestment.vercel.app/dashboard" className="left back-btn">
          <i className="icon-left-btn"></i>
        </a>
        <h3>Verification</h3>
        <a href="https://ocicinvestment.vercel.app/dashboard" className="right">
          <i className="icon-question"></i>
        </a>
      </div>
      <div className="pt-60 mt-5 pb-4">
        <div className="tf-container">
          <div
            className="mt-4 p-4"
            style={{
              borderRadius: "18px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              padding: "24px",
            }}
          >
            {/* Title */}
            <div className="d-flex align-items-center mb-3 gap-2">
              <i className="fas fa-shield-alt fs-4 text-warning"></i>
              <h4 className="mb-0 fw-bold">Identity Verification</h4>
            </div>

            {/* Description */}
            <p style={{ opacity: 0.7, fontSize: "13px", marginTop: "4px" }}>
              Complete your identity verification to unlock full features and
              enhance account security.
            </p>

            {/* Features & Limitations */}
            <h6
              className="mt-20 text-uppercase fw-semibold"
              style={{ letterSpacing: "0.8px", opacity: 0.85 }}
            >
              Features & Limits
            </h6>

            <ul className="list-unstyled mt-3 mb-3 border-top border-light pt-3">
              <li className="d-flex justify-content-between align-items-center mb-3">
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-wallet text-warning"></i>
                  <span className="text-small">Maximum Deposit</span>
                </span>
                <span className="fw-bold">5,000,000 USD (Lifetime)</span>
              </li>

              <li className="d-flex justify-content-between align-items-center">
                <span className="d-flex align-items-center gap-2">
                  <i className="fas fa-money-bill-wave text-warning"></i>
                  <span className="text-small">Maximum Withdrawal</span>
                </span>
                <span className="fw-bold">5,000,000 USD (Lifetime)</span>
              </li>
            </ul>

            {/* Requirements */}
            <h6
              className="mt-4 text-uppercase fw-semibold"
              style={{ letterSpacing: "0.8px", opacity: 0.85 }}
            >
              Requirements
            </h6>

            <div className="mt-3 d-flex flex-column gap-2">
              <p className="d-flex align-items-center gap-2 mb-0">
                <i className="fas fa-user text-info"></i>
                Personal Information
              </p>

              <p className="d-flex align-items-center gap-2 mb-0">
                <i className="fas fa-id-card text-info"></i>
                Government-Issued ID Card
              </p>
            </div>

            {/* Start Verification Button */}
            <a
              href="/ChooseVerification"
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 mt-4"
              style={{
                background: "#ffc107",
                color: "#000",
                fontWeight: "600",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              }}
            >
              <i className="fas fa-shield-check"></i>
              Start Verification
            </a>
          </div>
        </div>
      </div>
      <FadeLoader
        color="#36d7b7"
        loading={loading}
        speedMultiplier={3}
        style={{ textAlign: "center", position: "relative", marginLeft: "50%" }}
      />
    </>
  );
};

export default Verification;
