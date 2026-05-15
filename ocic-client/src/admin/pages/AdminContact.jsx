import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const AdminContact = () => {
  const Admin = JSON.parse(localStorage.getItem("admin1"));
  const adminEmail = Admin.email;
  const email = localStorage.getItem("chatID");

  const [chat, setChat] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [checkDelete, setCheckDelete] = useState("");
  const [message, setMessage] = useState({
    value: "",
    from: "admin1",
    email: email,
  });
  useEffect(() => {
    const email = localStorage.getItem("chatID");
    const getChat = async () => {
      await axios.post("/getAdminChat", { email }).then((data) => {
        if (data.data.chat) {
          setChat(data.data.chat);
        } else if (data.data.message) {
        }
      });
    };
    getChat();
  }, []);

  const sendChat = async () => {
    const { value, from, email } = message;
    console.log(value);
    await axios
      .post("/chatSend", {
        value,
        from,
        email,
      })
      .then((data) => {
        if (data.data.chat) {
          toast.success("Message Sent");
          console.log(data.data.chat);
          setChat(data.data.chat);
          setMessage({ ...message, value: "" });
        } else if (data.data.error) {
          toast.error(data.data.error);
          console.log(data.data.error);
        }
      });
  };

  const deleteAction = (ID) => {
    setCheckDelete(ID);
    setIsDelete(true);
  };

  const getChat = async () => {
    await axios.post("/getAdminChat", { email }).then((data) => {
      if (data.data.chat) {
        setChat(data.data.chat);
      } else if (data.data.message) {
      }
    });
  };

  const deleteChat = async (id) => {
    await axios.post("/deleteChat", { id }).then((data) => {
      if (data.data.success) {
        getChat();
        toast.success(data.data.success);
      }
    });
  };
  return (
    <>
      <div
        style={{ marginTop: "80px", background: "#0a0f1f" }}
        className="container-scroller"
      >
        <div className="container-fluid page-body-wrapper">
          <div className="main-panel m-0 w-100">
            <div className="content-wrapper">
              <div
                className="row"
                style={{
                  height: "100vh",
                  overflowY: "auto",
                  padding: "90px 15px 120px",
                }}
              >
                {/* HEADER */}
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 10,
                    backdropFilter: "blur(12px)",
                    background:
                      "linear-gradient(135deg, rgba(10,15,31,0.95), rgba(20,30,60,0.85))",
                    borderBottom: "1px solid rgba(255,215,0,0.15)",
                  }}
                >
                  <div
                    style={{
                      padding: "15px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <img
                      src="/img/top_img.png"
                      width={45}
                      style={{
                        borderRadius: "50%",
                        border: "2px solid gold",
                        boxShadow: "0 0 10px rgba(255,215,0,0.5)",
                      }}
                      alt="avatar"
                    />
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600" }}>
                        Chat Panel
                      </div>
                      <small style={{ color: "gold" }}>Live Conversation</small>
                    </div>
                  </div>
                </div>

                {/* CHAT LIST */}
                <div
                  style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}
                >
                  {chat.length >= 1 &&
                    chat.map((data) => (
                      <div
                        key={data._id}
                        onClick={() => deleteAction(data._id)}
                        style={{
                          display: "flex",
                          justifyContent:
                            data.from === "admin1" ? "flex-end" : "flex-start",
                          marginBottom: "18px",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "75%",
                            padding: "14px 16px",
                            borderRadius: "16px",
                            background:
                              data.from === "admin1"
                                ? "linear-gradient(135deg, #FFD700, #C9A000)"
                                : "linear-gradient(135deg, rgba(20,30,60,0.9), rgba(10,15,31,0.9))",
                            color: data.from === "admin1" ? "#000" : "#eaeaea",
                            boxShadow:
                              data.from === "admin1"
                                ? "0 4px 20px rgba(255,215,0,0.3)"
                                : "0 4px 20px rgba(0,0,0,0.5)",
                            border:
                              data.from === "user"
                                ? "1px solid rgba(255,215,0,0.1)"
                                : "none",
                          }}
                        >
                          {/* NAME */}
                          <div
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              marginBottom: "6px",
                              opacity: 0.8,
                              textAlign:
                                data.from === "admin1" ? "right" : "left",
                              color: data.from === "admin1" ? "#000" : "gold",
                            }}
                          >
                            {data.from === "admin1" ? "You" : "User"}
                          </div>

                          {/* MESSAGE */}
                          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                            {data.message}
                          </div>

                          {/* DELETE */}
                          {data.from === "admin1" &&
                            isDelete &&
                            checkDelete === data._id && (
                              <div
                                onClick={() => deleteChat(data._id)}
                                style={{
                                  marginTop: "8px",
                                  fontSize: "12px",
                                  color: "#ff4d4f",
                                  cursor: "pointer",
                                  textAlign: "right",
                                }}
                              >
                                Delete message?
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* INPUT */}
                <div
                  style={{
                    position: "fixed",
                    bottom: 0,
                    width: "100%",
                    zIndex: 10,
                    backdropFilter: "blur(12px)",
                    background:
                      "linear-gradient(135deg, rgba(10,15,31,0.95), rgba(20,30,60,0.9))",
                    borderTop: "1px solid rgba(255,215,0,0.15)",
                    padding: "12px 10px",
                  }}
                >
                  <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <form className="forms-sample">
                      <div
                        className="input-group"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "rgba(255,255,255,0.05)",
                          borderRadius: "12px",
                          padding: "8px",
                          border: "1px solid rgba(255,215,0,0.1)",
                        }}
                      >
                        <textarea
                          value={message.value}
                          onChange={(e) =>
                            setMessage({ ...message, value: e.target.value })
                          }
                          placeholder="Type your message..."
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            resize: "none",
                            height: "45px",
                            outline: "none",
                            flex: 1,
                            fontSize: "14px",
                          }}
                        />

                        <div
                          onClick={sendChat}
                          style={{
                            background:
                              "linear-gradient(135deg, #FFD700, #C9A000)",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            cursor: "pointer",
                            marginLeft: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(255,215,0,0.4)",
                          }}
                        >
                          <i
                            className="fas fa-paper-plane"
                            style={{ color: "#000" }}
                          ></i>
                        </div>
                      </div>
                    </form>
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

export default AdminContact;
