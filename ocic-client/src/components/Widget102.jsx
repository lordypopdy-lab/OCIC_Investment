import React, { useEffect } from "react";

const Widget102 = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbol: "BINANCE:BNBUSDT",
      height: 220,
      locale: "en",
      dateRange: "12M",
      colorTheme: "dark",
      trendLineColor: "rgba(41, 98, 255, 1)",
      underLineColor: "rgba(41, 98, 255, 0.3)",
      underLineBottomColor: "rgba(41, 98, 255, 0)",
      isTransparent: true,
      autosize: true,
      largeChartUrl: "",
    });

    const container = document.querySelector(
      ".tradingview-widget-container__widget"
    );
    if (container) container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="card shadow-lg rounded-4 p-3 mb-3"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        maxWidth: "100%",
      }}
    >
      <h5 className="fw-bold mb-3 text-white">
        <i className="fab fa-bitcoin me-2"></i>BNB/USDT Overview
      </h5>

      <div className="tradingview-widget-container rounded-3 overflow-hidden">
        <div className="tradingview-widget-container__widget"></div>
      </div>

      <div
        className="mt-2 text-end"
        style={{ fontSize: "0.75rem", opacity: 0.7 }}
      >
        <a
          href="#"
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          BNBUSDT Rates
        </a>{" "}
      </div>
    </div>
  );
};

export default Widget102
