import React from "react";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Widget101 from "../../components/Widget101";
import Widget102 from "../../components/Widget102";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import axios from "axios";
import toast from "react-hot-toast";

const Admin = () => {
  if (!localStorage.getItem("admin1")) {
    window.location.href = "/admin/login";
  }
  const [isDelete, setDelete] = useState();
  const [isApprove, setApprove] = useState("");
  const [isDecline, setDecline] = useState("");
  const [balance, setBalance] = useState(6056);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [bankR, setBankR] = useState([]);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show6, setShow6] = useState(false);
  const [show7, setShow7] = useState(false);
  const [show8, setShow8] = useState(false);
  const [show9, setShow9] = useState(false);
  const [kycAction, setKycAction] = useState("");
  const [kycDecline, setKycDecline] = useState("");
  const [kycApprove, setKycApprove] = useState("");
  const [cryptoR, setCryptoR] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoading1, setLoading1] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [isLoading3, setLoading3] = useState(false);
  const [isLoading4, setLoading4] = useState(false);
  const [isLoading5, setLoading5] = useState(false);
  const [isLoading6, setLoading6] = useState(false);
  const [isLoading7, setLoading7] = useState(false);
  const [isLoading8, setLoading8] = useState(false);
  const [isLoading9, setLoading9] = useState(false);
  const [UID, setUID] = useState({ ID: "", ULevel: "" });
  const [message, setMessage] = useState({ id: "", value: "" });
  const [notification, setNotification] = useState({ id: "", value: "" });
  const [adder, setAdder] = useState({ id: "", value: "", type: "" });
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [mailer, setMailer] = useState({ email: "", message: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userAuth, setUserAuth] = useState([]);

  useEffect(() => {
    const Admin = JSON.parse(localStorage.getItem("admin1"));
    const email = Admin.email;

    const getKyc = async () => {
      await axios.get("/fetchAllKyc").then((data) => {
        if (data.data.kyc) {
          setUserAuth(data.data.kyc);
        }
      });
    };
    getKyc();

    const getCryptoRecords = async () => {
      await axios.post("/AdminGetCrypto", { email }).then((data) => {
        if (data) {
          setCryptoR(data.data);
        }
      });
    };
    const getBankRecords = async () => {
      await axios.post("/AdminGetBankR", { email }).then((data) => {
        if (data) {
          setBankR(data.data);
        }
      });
    };
    const getUsers = async () => {
      try {
        await axios.get("/getUsers").then((data) => {
          if (data.data.length > 0) {
            setUsers(data.data);
          }
        });
      } catch (error) {
        console.log(`Error Getting Users: `, error);
      }
    };
    function simulateNetworkRequest() {
      return new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
    getUsers();
    getBankRecords();
    getCryptoRecords();
  }, [isLoading]);

  const addBalance = async () => {
    {
      !isLoading1 ? setLoading1(true) : null;
    }
    const { id, value, type } = adder;

    try {
      await axios
        .post("/addBalance", {
          id,
          value,
          type,
        })
        .then((data) => {
          if (data.data.error) {
            toast.error(data.data.error);
            setLoading1(false);
          } else if (data.data.success) {
            toast.success(data.data.success);
            console.log(data.data.success);
            setLoading1(false);
            setAdder({
              id: "",
              value: "",
              type: "",
            });
          }
        });
    } catch (error) {
      console.log("Error Adding Balance: ", error);
    }
  };

  const handleClick = (data) => {
    setLoading(true);
    console.log(data);
    localStorage.setItem("chatID", data);
    window.location.href = "/admin/contact";
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  const handleClose7 = () => setShow7(false);
  const handleShow7 = (data) => {
    setShow7(true);
    setKycAction(data);
  };
  const handleClose8 = () => setShow8(false);
  const handleShow8 = (data) => {
    setShow8(true);
    setKycDecline(data);
  };
  const handleClose9 = () => setShow9(false);
  const handleShow9 = (data) => {
    setShow9(true);
    setKycApprove(data);
  };

  const handleKyApprove = async () => {
    handleShow9();
    setLoading9(true);

    await axios.post("/approveKyc", { kycApprove }).then((data) => {
      if (data.data.success) {
        setLoading9(false);
        toast.success(data.data.success);
        console.log(data.data);
      } else if (data.data.error) {
        setLoading9(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleKyDecline = async () => {
    handleShow8();
    setLoading8(true);

    await axios.post("/declineKyc", { kycDecline }).then((data) => {
      if (data.data.success) {
        setLoading8(false);
        toast.success(data.data.success);
        console.log(data.data);
      } else if (data.data.error) {
        setLoading8(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleKycAction = async () => {
    handleShow7();
    setLoading7(true);

    await axios.post("/deleteKyc", { kycAction }).then((data) => {
      if (data.data.success) {
        toast.success(data.data.success);
        setLoading7(false);
      } else if (data.data.error) {
        setLoading7(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const handleClose4 = () => setShow4(false);
  const handleShow4 = (data) => {
    setShow4(true);
    setDecline(data);
  };
  const handleClose5 = () => setShow5(false);
  const handleShow5 = (data) => {
    setShow5(true);
    setApprove(data);
  };
  const handleClose6 = () => setShow6(false);
  const handleShow6 = (data) => {
    setShow6(true);
    setDelete(data);
  };

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied successfully!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const handleMessage = async () => {
    setLoading2(true);
    const { id, value } = message;
    console.log(id);
    await axios.post("/userMessage", { id, value }).then((data) => {
      if (data.data.success) {
        toast.success(data.data.success);
        setMessage({
          id: "",
          value: "",
        });
        setLoading2(false);
      } else if (data.data.error) {
        setLoading2(false);
        toast.error(data.data.error);
      }
    });
    // handleClose3()
  };

  const handleNotification = async () => {
    setLoading3(true);
    const { id, value } = notification;
    console.log(id);
    await axios.post("/userNotification", { id, value }).then((data) => {
      if (data.data.success) {
        toast.success(data.data.success);
        setNotification({
          id: "",
          value: "",
        });
        setLoading3(false);
      } else if (data.data.error) {
        setLoading3(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleDecline = async () => {
    handleShow4();
    setLoading4(true);
    await axios.post("/Decline", { isDecline }).then((data) => {
      if (data.data.success) {
        setLoading4(false);
        toast.success(data.data.success);
      } else if (data.data.error) {
        setLoading4(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleApprove = async () => {
    handleShow5();
    setLoading5(true);
    await axios.post("/Approve", { isApprove }).then((data) => {
      if (data.data.success) {
        setLoading5(false);
        toast.success(data.data.success);
      } else if (data.data.error) {
        setLoading5(false);
        toast.error(data.data.error);
      }
    });
  };

  const handleDelete = async () => {
    handleShow6();
    setLoading6(true);
    await axios.post("/Delete", { isDelete }).then((data) => {
      if (data.data.success) {
        setLoading6(false);
        toast.success(data.data.success);
      } else if (data.data.error) {
        setLoading6(false);
        toast.error(data.data.error);
      }
    });
  };

  const upgradeAccount = async (event) => {
    event.preventDefault();
    const { ID, ULevel } = UID;
    try {
      await axios.post("/upgradeAccount", { ID, ULevel }).then((data) => {
        if (data.data.success) {
          toast.success(data.data.success);
          setUID({
            ID: "",
            ULevel: "",
          });
        } else if (data.data.error) {
          toast.error(data.data.error);
          setUID({
            ID: "",
            ULevel: "",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserID) return;

    setIsDeleting(true);
    try {
      const res = await axios.post("/deleteUser", { userID: selectedUserID });

      if (res.data.success) {
        toast.success("User deleted successfully!");
        setShowConfirm(false);
        setSelectedUserID(null);
        refreshUsers();
      } else {
        toast.error(res.data.msg || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sendMail = async () => {
    try {
      const { email, message } = mailer;

      if (!email || !message) {
        toast.error("All fields are required");
        return;
      }

      const { data } = await axios.post("/sendMail", {
        email,
        message,
      });

      if (data.success) {
        toast.success(data.success);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email");
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ marginTop: "80px" }} className="container-scroller">
        <Widget102 />
        <Modal
          centered
          show={show}
          onHide={handleClose}
          contentClassName="border-0 rounded-4 shadow-lg"
        >
          <div
            style={{
              background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 60%,
          rgba(238, 219, 12, 0.12) 100%
        )
      `,
              color: "white",
              borderRadius: "16px",
            }}
          >
            {/* HEADER */}
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-0 pb-0"
            >
              <div>
                <Modal.Title className="fw-bold">
                  Account Adjustment
                </Modal.Title>
                <p className="mb-0 text-light" style={{ opacity: 0.7 }}>
                  Add bonus, profit or deposit to a user account.
                </p>
              </div>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body className="pt-4">
              <Form>
                {/* USER ID */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">User ID</Form.Label>

                  <Form.Control
                    type="text"
                    value={adder.id}
                    onChange={(e) => setAdder({ ...adder, id: e.target.value })}
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter user ID"
                  />
                </Form.Group>

                {/* AMOUNT */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Amount</Form.Label>

                  <div className="input-group">
                    <span className="input-group-text bg-dark text-warning border-secondary">
                      $
                    </span>

                    <Form.Control
                      type="number"
                      value={adder.value}
                      onChange={(e) =>
                        setAdder({ ...adder, value: e.target.value })
                      }
                      className="bg-dark text-white border-secondary"
                      placeholder="0.00"
                    />

                    <span className="input-group-text bg-dark border-secondary text-light">
                      USD
                    </span>
                  </div>
                </Form.Group>

                {/* TYPE */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Adjustment Type
                  </Form.Label>

                  <Form.Select
                    value={adder.type}
                    onChange={(e) =>
                      setAdder({ ...adder, type: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                  >
                    <option value="">Select adjustment type</option>
                    <option value="bonuse">Add Bonus</option>
                    <option value="profit">Add Profit</option>
                    <option value="deposit">Add Deposit</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>

            {/* FOOTER */}
            <Modal.Footer className="border-0 pt-0 d-flex justify-content-between">
              <Button
                variant="outline-light"
                onClick={handleClose}
                className="px-4 rounded-3"
              >
                Cancel
              </Button>

              <Button
                onClick={addBalance}
                disabled={isLoading1}
                className="px-4 rounded-3 fw-semibold"
                style={{
                  backgroundColor: "#facc15",
                  border: "none",
                  color: "#0f172a",
                }}
              >
                {isLoading1 ? "Processing..." : "Confirm"}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Modal
          centered
          show={show1}
          onHide={handleClose1}
          contentClassName="border-0 rounded-4 shadow-lg"
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "white",
              borderRadius: "16px",
              maxHeight: "90vh",
            }}
          >
            {/* HEADER */}
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-0 pb-0"
            >
              <div>
                <Modal.Title className="fw-bold">Users Overview</Modal.Title>
                <p className="mb-0 text-light" style={{ opacity: 0.7 }}>
                  Complete list of all users and account details
                </p>
              </div>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body style={{ overflowY: "auto", maxHeight: "70vh" }}>
              <Table
                responsive
                bordered
                hover
                className="text-white mb-0"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <thead style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <tr>
                    <th>#ID</th>
                    <th>
                      <i className="fas fa-paper-plane text-success"></i>
                    </th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profit</th>
                    <th>Bonus</th>
                    <th>Deposit</th>
                    <th>Country</th>
                    <th>Account</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        style={{ cursor: "default" }}
                        className="align-middle"
                      >
                        <td
                          onClick={() => handleCopy(user._id)}
                          style={{ cursor: "pointer" }}
                          title="Click to copy ID"
                        >
                          <i className="fas fa-copy me-1"></i>
                          {user._id.slice(0, 5)}…
                        </td>

                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            disabled={isLoading}
                            onClick={
                              !isLoading ? () => handleClick(user.email) : null
                            }
                          >
                            {isLoading ? "Sending…" : "Send"}
                          </Button>
                        </td>

                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.currency}
                          {user.profit.toFixed(2)}
                        </td>
                        <td>
                          {user.currency}
                          {user.bonuse.toFixed(2)}
                        </td>
                        <td>
                          {user.currency}
                          {user.deposit.toFixed(2)}
                        </td>
                        <td>{user.country}</td>
                        <td>{user.account}</td>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setSelectedUserID(user._id);
                            setShowConfirm(true);
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete user"}
                        </Button>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">
                        No users available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Modal.Body>

            {/* FOOTER */}
            <Modal.Footer className="border-0 d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="px-4 rounded-3 me-2"
                onClick={handleClose1}
              >
                Close
              </Button>
              <Button
                variant="warning"
                className="px-4 rounded-3 fw-semibold"
                onClick={handleClose1}
              >
                Done <i className="fas fa-check ms-1"></i>
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Modal
          show={showConfirm}
          onHide={() => setShowConfirm(false)}
          centered
          contentClassName="border-0 shadow-lg rounded-4"
        >
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              color: "white",
              borderRadius: "16px",
              padding: "1rem",
              maxWidth: "500px",
            }}
          >
            {/* HEADER */}
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-0 pb-2"
            >
              <Modal.Title className="fw-bold text-warning">
                Confirm
              </Modal.Title>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  opacity: 0.85,
                }}
              >
                Are you sure you want to delete this user? <br />
                This action <strong>cannot</strong> be undone.
              </p>
            </Modal.Body>

            {/* FOOTER */}
            <Modal.Footer className="border-0 d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="px-4 rounded-3 me-2"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="px-4 rounded-3 fw-semibold"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Modal className="mt-4" show={show2} onHide={handleClose2}>
          <Modal.Header className="bg-dark" closeButton>
            <Modal.Title className="card-gradient">
              List of Investors
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark modal-body-scroll">
            <Table responsive="xl">
              <thead>
                <tr>
                  <th>[#]</th>
                  <th>[Name]</th>
                  <th>[Country]</th>
                  <th>[Account]</th>
                  <th>[Profit]</th>
                  <th>[Bonus]</th>
                  <th>[Deposit]</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Rita pedro</td>
                  <td>Brazil</td>
                  <td>Forex</td>
                  <td>$230.90</td>
                  <td>$8977.45</td>
                  <td>$78826.51</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="bg-dark d-flex justify-content-between">
            <Button
              style={{ padding: "8px", width: "120px" }}
              variant="secondary"
              onClick={handleClose2}
            >
              Close
            </Button>
            <Button
              style={{ padding: "8px", width: "160px" }}
              variant="primary"
              onClick={handleClose2}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          centered
          show={show3}
          onHide={handleClose3}
          contentClassName="border-0 rounded-4 shadow-lg"
        >
          <div
            style={{
              background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 60%,
          rgba(238, 219, 12, 0.12) 100%
        )
      `,
              color: "white",
              borderRadius: "16px",
              maxHeight: "90vh",
            }}
          >
            {/* HEADER */}
            <Modal.Header
              closeButton
              closeVariant="white"
              className="border-0 pb-0"
            >
              <div>
                <Modal.Title className="fw-bold">
                  Send Notifications
                </Modal.Title>
                <p className="mb-0 text-light" style={{ opacity: 0.7 }}>
                  Submit messages or notifications to selected users.
                </p>
              </div>
            </Modal.Header>

            {/* BODY */}
            <Modal.Body
              className="pt-4"
              style={{ overflowY: "auto", maxHeight: "70vh" }}
            >
              {/* Submit Message Form */}
              <Form className="mb-5">
                <h6 className="fw-semibold text-warning mb-3">
                  Submit Message
                </h6>

                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={message.id}
                    onChange={(e) =>
                      setMessage({ ...message, id: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter user ID"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={message.value}
                    onChange={(e) =>
                      setMessage({ ...message, value: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter your message here..."
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  className="px-4 rounded-3 fw-semibold"
                  disabled={isLoading2}
                  onClick={!isLoading2 ? handleMessage : null}
                >
                  {isLoading2 ? "Sending..." : "Send Message"}
                </Button>
              </Form>

              {/* Notification Message Form */}
              <Form>
                <h6 className="fw-semibold text-warning mb-3">
                  Notification Message
                </h6>

                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={notification.id}
                    onChange={(e) =>
                      setNotification({ ...notification, id: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter user ID"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notification</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notification.value}
                    onChange={(e) =>
                      setNotification({
                        ...notification,
                        value: e.target.value,
                      })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter notification text..."
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  className="px-4 rounded-3 fw-semibold"
                  disabled={isLoading3}
                  onClick={!isLoading3 ? handleNotification : null}
                >
                  {isLoading3 ? "Sending..." : "Send Notification"}
                </Button>
              </Form>
              {/* Custom Mailer Form */}
              <Form className="mt-5">
                <h6 className="fw-semibold text-warning mb-3">Custom Mailer</h6>

                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={mailer.email}
                    onChange={(e) =>
                      setMailer({ ...mailer, email: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter Recipient's Email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={mailer.message}
                    onChange={(e) =>
                      setMailer({ ...mailer, message: e.target.value })
                    }
                    className="bg-dark text-white border-secondary rounded-3"
                    placeholder="Enter Email text..."
                  />
                </Form.Group>

                <Button
                  variant="warning"
                  className="px-4 rounded-3 fw-semibold"
                  disabled={isLoading3}
                  onClick={!isLoading3 ? sendMail : null}
                >
                  {isLoading3 ? "Sending..." : "Send Mail"}
                </Button>
              </Form>
            </Modal.Body>

            {/* FOOTER */}
            <Modal.Footer className="border-0 pt-0 d-flex justify-content-end">
              <Button
                variant="outline-light"
                className="px-4 rounded-3"
                onClick={handleClose3}
              >
                Close
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Modal className="mt-4" show={show4} onHide={handleClose4}>
          <Modal.Header className="bg-dark" closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark modal-body-scroll">
            <div className="card-title text-warning">
              Are you Sure yoo want to Decline This Transaction?
            </div>
            <Button
              variant="primary"
              style={{ height: "auto", padding: "8px", width: "160px" }}
              disabled={isLoading4}
              onClick={!isLoading4 ? handleDecline : null}
            >
              {isLoading4 ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button
              style={{ padding: "8px", width: "120px" }}
              variant="secondary"
              onClick={handleClose4}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal className="mt-4" show={show5} onHide={handleClose5}>
          <Modal.Header className="bg-dark" closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark modal-body-scroll">
            <div className="card-title text-warning">
              Are you Sure yoo want to Approve This Transaction?
            </div>
            <Button
              variant="primary"
              style={{ height: "auto", padding: "8px", width: "160px" }}
              disabled={isLoading5}
              onClick={!isLoading5 ? handleApprove : null}
            >
              {isLoading5 ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button
              style={{ padding: "8px", width: "120px" }}
              variant="secondary"
              onClick={handleClose5}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal className="mt-4" show={show6} onHide={handleClose6}>
          <Modal.Header className="bg-dark" closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark modal-body-scroll">
            <div className="card-title text-warning">
              Are you Sure yoo want to Delete This Transaction?
            </div>
            <Button
              variant="primary"
              style={{ height: "auto", padding: "8px", width: "160px" }}
              disabled={isLoading6}
              onClick={!isLoading6 ? handleDelete : null}
            >
              {isLoading6 ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button
              style={{ padding: "8px", width: "120px" }}
              variant="secondary"
              onClick={handleClose6}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* DELETE KYC MODAL */}
        <Modal show={show7} onHide={handleClose7} centered>
          <Modal.Header
            closeButton
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#ffc107",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Modal.Title>⚠️ Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#ffffff",
              borderRadius: "0 0 12px 12px",
              textAlign: "center",
            }}
          >
            <p className="mb-4" style={{ fontSize: "16px", fontWeight: "500" }}>
              Are you sure you want to delete this KYC request?
            </p>
            <Button
              onClick={!isLoading7 ? handleKycAction : null}
              disabled={isLoading7}
              style={{
                width: "160px",
                padding: "10px",
                background: "#dc3545",
                border: "none",
                fontWeight: "600",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                borderRadius: "8px",
              }}
            >
              {isLoading7 ? "Deleting..." : "Delete ❌"}
            </Button>
          </Modal.Body>
          <Modal.Footer
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              justifyContent: "center",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleClose7}
              style={{ width: "120px", fontWeight: "500" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* DECLINE KYC MODAL */}
        <Modal show={show8} onHide={handleClose8} centered>
          <Modal.Header
            closeButton
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#ffc107",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Modal.Title>⚠️ Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#ffffff",
              borderRadius: "0 0 12px 12px",
              textAlign: "center",
            }}
          >
            <p className="mb-4" style={{ fontSize: "16px", fontWeight: "500" }}>
              Are you sure you want to decline this KYC request?
            </p>
            <Button
              onClick={!isLoading8 ? handleKyDecline : null}
              disabled={isLoading8}
              style={{
                width: "160px",
                padding: "10px",
                background: "#ffc107",
                border: "none",
                fontWeight: "600",
                color: "#000",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                borderRadius: "8px",
              }}
            >
              {isLoading8 ? "Declining..." : "Decline ⚡"}
            </Button>
          </Modal.Body>
          <Modal.Footer
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              justifyContent: "center",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleClose8}
              style={{ width: "120px", fontWeight: "500" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* APPROVE KYC MODAL */}
        <Modal show={show9} onHide={handleClose9} centered>
          <Modal.Header
            closeButton
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#28a745",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Modal.Title>✅ Confirm Approval</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              color: "#ffffff",
              borderRadius: "0 0 12px 12px",
              textAlign: "center",
            }}
          >
            <p className="mb-4" style={{ fontSize: "16px", fontWeight: "500" }}>
              Are you sure you want to approve this KYC request?
            </p>
            <Button
              onClick={!isLoading9 ? handleKyApprove : null}
              disabled={isLoading9}
              style={{
                width: "160px",
                padding: "10px",
                background: "#28a745",
                border: "none",
                fontWeight: "600",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                borderRadius: "8px",
              }}
            >
              {isLoading9 ? "Approving..." : "Approve ✅"}
            </Button>
          </Modal.Body>
          <Modal.Footer
            style={{
              background:
                "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              justifyContent: "center",
            }}
          >
            <Button
              variant="secondary"
              onClick={handleClose9}
              style={{ width: "120px", fontWeight: "500" }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container-fluid page-body-wrapper">
          <div className="main-panel m-0 w-100">
            <div className="content-wrapper">
              <div className="row">
                <div
                  style={{ borderRadius: "0px" }}
                  className="col-xl-6 p-2 col-sm-6"
                >
                  <div
                    className="card border-0 shadow-sm rounded-4 text-dark"
                    style={{
                      background: `
      linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(238, 219, 12, 0.6250875350140056) 84%,
        rgba(255, 193, 7, 0.4206057422969187) 100%
      )
    `,
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        {/* Left Section */}
                        <div>
                          <h6
                            className="text-uppercase fw-semibold mb-2 text-muted"
                            style={{ letterSpacing: "1px" }}
                          >
                            Market Cap
                          </h6>

                          <div className="d-flex align-items-center">
                            <h2 className="fw-bold mb-0 me-3">
                              {isBalanceVisible ? (
                                <>
                                  <span className="fs-5 text-secondary">$</span>
                                  {balance.toFixed(2)}
                                </>
                              ) : (
                                "••••••"
                              )}
                            </h2>

                            <button
                              onClick={toggleBalanceVisibility}
                              className="btn btn-sm btn-light border rounded-circle shadow-sm"
                              aria-label={
                                isBalanceVisible
                                  ? "Hide Balance"
                                  : "Show Balance"
                              }
                            >
                              <FontAwesomeIcon
                                icon={isBalanceVisible ? faEyeSlash : faEye}
                              />
                            </button>
                          </div>

                          <small className="fw-medium d-flex align-items-center mt-2 text-dark">
                            <i className="fas fa-arrow-up me-1"></i> +2.45%
                            Today
                          </small>
                        </div>

                        {/* Right Icon Section */}
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3"
                          style={{
                            width: "55px",
                            height: "55px",
                            background: "rgba(255,255,255,0.6)",
                          }}
                        >
                          <i className="fas fa-chart-line fs-4 text-dark"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-sm-6 mt-3">
                  <div
                    className="card border-0 shadow-lg rounded-4 text-white h-100"
                    style={{
                      background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 40%,
          rgba(238, 219, 12, 0.45) 84%,
          rgba(255, 193, 7, 0.35) 100%
        )
      `,
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="row g-4">
                        {/* VALUE ADDED */}
                        <div className="col-6">
                          <div className="d-flex flex-column h-100">
                            <h6
                              className="text-uppercase fw-semibold mb-2 text-light"
                              style={{ letterSpacing: "1px", opacity: 0.8 }}
                            >
                              Value Added
                            </h6>

                            <div className="d-flex align-items-center mb-2">
                              <h4 className="fw-bold mb-0 me-2">
                                {isBalanceVisible ? (
                                  <>
                                    <span className="fs-6 text-warning">$</span>
                                    {(balance - 3925).toFixed(2)}
                                  </>
                                ) : (
                                  "••••••"
                                )}
                              </h4>
                              <span className="badge bg-warning text-dark fw-medium">
                                +18%
                              </span>
                            </div>

                            <button
                              onClick={handleShow}
                              className="btn btn-warning btn-sm mt-auto rounded-3 fw-semibold"
                            >
                              Balance Adder
                              <i className="fas fa-plus ms-2"></i>
                            </button>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="col-6">
                          <div className="d-flex flex-column h-100">
                            <h6
                              className="text-uppercase fw-semibold mb-2 text-light"
                              style={{ letterSpacing: "1px", opacity: 0.8 }}
                            >
                              Actions
                            </h6>

                            <div className="d-flex align-items-center mb-2">
                              <h4 className="fw-bold mb-0 me-2">
                                {isBalanceVisible ? (
                                  <>
                                    <span className="fs-6 text-warning">$</span>
                                    {(balance - 1260).toFixed(2)}
                                  </>
                                ) : (
                                  "••••••"
                                )}
                              </h4>
                              <span className="badge bg-warning text-dark fw-medium">
                                +18%
                              </span>
                            </div>

                            <button
                              onClick={handleShow3}
                              className="btn btn-outline-light btn-sm mt-auto rounded-3 fw-semibold"
                            >
                              Message Sender
                              <i className="fas fa-paper-plane ms-2"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Widget101 />
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="card border-0 shadow-lg rounded-4 text-white"
                    style={{
                      background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 45%,
          rgba(238, 219, 12, 0.35) 85%,
          rgba(255, 193, 7, 0.25) 100%
        )
      `,
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="row g-4">
                        {/* TOTAL USERS */}
                        <div className="col-md-6">
                          <div className="d-flex flex-column h-100">
                            <h6
                              className="text-uppercase fw-semibold mb-2"
                              style={{ letterSpacing: "1px", opacity: 0.8 }}
                            >
                              Total Users
                            </h6>

                            <div className="d-flex align-items-center mb-3">
                              <h3 className="fw-bold mb-0 me-3">
                                {isBalanceVisible
                                  ? users.length >= 1
                                    ? users.length
                                    : "Loading..."
                                  : "••••••"}
                              </h3>

                              <span className="badge bg-warning text-dark fw-semibold">
                                +28%
                              </span>
                            </div>

                            <button
                              onClick={handleShow1}
                              className="btn btn-outline-light btn-sm rounded-3 fw-semibold mt-auto"
                            >
                              View Users
                              <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </div>

                        {/* TOTAL INVESTORS */}
                        <div className="col-md-6">
                          <div className="d-flex flex-column h-100">
                            <h6
                              className="text-uppercase fw-semibold mb-2"
                              style={{ letterSpacing: "1px", opacity: 0.8 }}
                            >
                              Total Investors
                            </h6>

                            <div className="d-flex align-items-center mb-3">
                              <h3 className="fw-bold mb-0 me-3">
                                {isBalanceVisible
                                  ? bankR.length >= 1
                                    ? bankR.length + cryptoR.length
                                    : 0
                                  : "••••••"}
                              </h3>

                              <span className="badge bg-warning text-dark fw-semibold">
                                +68%
                              </span>
                            </div>

                            <button
                              onClick={handleShow2}
                              className="btn btn-warning btn-sm rounded-3 fw-semibold mt-auto"
                            >
                              View Investors
                              <i className="fas fa-arrow-right ms-2"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div
                    className="card border-0 shadow-lg rounded-4 text-white"
                    style={{
                      background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 50%,
          rgba(238, 219, 12, 0.25) 100%
        )
      `,
                    }}
                  >
                    <div className="card-body p-5">
                      {/* Header */}
                      <div className="mb-4">
                        <h4 className="fw-bold mb-1">Account Upgrade</h4>
                        <p className="text-light mb-0" style={{ opacity: 0.7 }}>
                          Upgrade a user's access level within the system.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={upgradeAccount}>
                        {/* USER ID */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-light">
                            User ID
                          </label>
                          <input
                            type="text"
                            value={UID.ID}
                            onChange={(e) =>
                              setUID({ ...UID, ID: e.target.value })
                            }
                            className="form-control form-control-lg bg-dark text-white border-secondary"
                            placeholder="Enter user ID"
                          />
                          <div
                            className="form-text text-light"
                            style={{ opacity: 0.6 }}
                          >
                            Provide the unique ID of the account to upgrade.
                          </div>
                        </div>

                        {/* LEVEL SELECT */}
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-light">
                            Upgrade Level
                          </label>
                          <select
                            value={UID.ULevel}
                            onChange={(e) =>
                              setUID({ ...UID, ULevel: e.target.value })
                            }
                            className="form-select form-select-lg bg-dark text-white border-secondary"
                          >
                            <option value="">Select upgrade level</option>
                            <option value="Level One">Level One</option>
                            <option value="Level Two">Level Two</option>
                            <option value="Level Three">Level Three</option>
                          </select>
                          <div
                            className="form-text text-light"
                            style={{ opacity: 0.6 }}
                          >
                            Choose the new access level for this account.
                          </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <div className="d-flex justify-content-end">
                          <button
                            type="submit"
                            className="btn btn-warning px-4 py-2 fw-semibold rounded-3"
                          >
                            Upgrade Account
                            <i className="fas fa-arrow-up ms-2"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div
                    className="card border-0 shadow-lg rounded-4 text-white"
                    style={{
                      background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 60%,
          rgba(238, 219, 12, 0.15) 100%
        )
      `,
                    }}
                  >
                    <div className="card-body p-4">
                      {/* Header */}
                      <div className="mb-3">
                        <h4 className="fw-bold mb-1">Withdrawal Requests</h4>
                        <p className="text-light mb-0" style={{ opacity: 0.7 }}>
                          Manage and process bank withdrawal requests.
                        </p>
                      </div>

                      {/* Scroll Container */}
                      <div
                        style={{
                          maxHeight: "400px",
                          overflowY: "auto",
                          borderRadius: "12px",
                        }}
                      >
                        <table className="table table-dark table-hover align-middle mb-0">
                          <thead
                            style={{
                              backgroundColor: "#0b1220",
                              position: "sticky",
                              top: 0,
                            }}
                          >
                            <tr className="text-uppercase small text-muted">
                              <th>ID</th>
                              <th>Amount</th>
                              <th>Bank</th>
                              <th>Name</th>
                              <th>Swift</th>
                              <th>Status</th>
                              <th>Email</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {bankR.length >= 1 ? (
                              bankR.map((data) => (
                                <tr key={data._id}>
                                  <td className="fw-semibold">
                                    {data._id.slice(1, 12)}
                                  </td>

                                  <td className="fw-bold text-warning">
                                    ${data.amount}
                                  </td>

                                  <td>{data.bank}</td>
                                  <td>{data.name}</td>
                                  <td>{data.swiftCode}</td>

                                  <td>
                                    <span
                                      className={`badge ${
                                        data.status === "Approved"
                                          ? "bg-success"
                                          : data.status === "Declined"
                                            ? "bg-danger"
                                            : "bg-warning text-dark"
                                      }`}
                                    >
                                      {data.status}
                                    </span>
                                  </td>

                                  <td style={{ opacity: 0.8 }}>{data.email}</td>

                                  <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                      <button
                                        onClick={() => handleShow4(data._id)}
                                        className="btn btn-outline-warning btn-sm"
                                      >
                                        Decline
                                      </button>

                                      <button
                                        onClick={() => handleShow5(data._id)}
                                        className="btn btn-outline-success btn-sm"
                                      >
                                        Approve
                                      </button>

                                      <button
                                        onClick={() => handleShow6(data._id)}
                                        className="btn btn-outline-danger btn-sm"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="8"
                                  className="text-center py-4 text-light"
                                  style={{ opacity: 0.7 }}
                                >
                                  No withdrawal records available.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 grid-margin mt-3 p-2">
                  <div
                    className="p-4"
                    style={{
                      borderRadius: "16px",
                      background:
                        "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                      color: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Header */}
                    <h3 className="text-center fw-bold mb-3">
                      Users | KYC | Authentication
                    </h3>
                    <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

                    {/* Table */}
                    <div
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        borderRadius: "12px",
                      }}
                      className="table-responsive"
                    >
                      <table className="table table-dark table-hover align-middle">
                        <thead>
                          <tr
                            style={{
                              borderBottom: "1px solid rgba(255,255,255,0.2)",
                            }}
                          >
                            <th>#</th>
                            <th>Email</th>
                            <th>OTP</th>
                            <th>Email Status</th>
                            <th>KYC Status</th>
                            <th>Identity Photo</th>
                            <th>Decline</th>
                            <th>Approve</th>
                            <th>Delete</th>
                          </tr>
                        </thead>

                        <tbody>
                          {userAuth.length > 0 ? (
                            userAuth.map((data, index) => (
                              <tr key={data._id}>
                                <td>ID:{data._id.slice(0, 8)}</td>
                                <td>{data.email}</td>
                                <td>{data.Otp}</td>
                                <td>{data.status || "Pending"}</td>
                                <td>{data.kycStatus || "Pending"}</td>
                                <td>
                                  {data.kycPic ? (
                                    <img
                                      src={data.kycPic}
                                      alt="Identity"
                                      width={120}
                                      height={80}
                                      className="rounded"
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                      }}
                                    />
                                  ) : (
                                    <span style={{ opacity: 0.7 }}>
                                      No Image
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleShow8(data._id)}
                                    className="btn btn-warning btn-sm px-3"
                                  >
                                    Decline
                                  </button>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleShow9(data._id)}
                                    className="btn btn-success btn-sm px-3"
                                  >
                                    Approve
                                  </button>
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleShow7(data._id)}
                                    className="btn btn-danger btn-sm px-3"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="9"
                                className="text-center py-4"
                                style={{ opacity: 0.7 }}
                              >
                                No Records Available!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3">
                  <div
                    className="card border-0 shadow-lg rounded-4 text-white"
                    style={{
                      background: `
        linear-gradient(
          135deg,
          #0f172a 0%,
          #1e293b 60%,
          rgba(238, 219, 12, 0.12) 100%
        )
      `,
                    }}
                  >
                    <div className="card-body p-4">
                      {/* Header */}
                      <div className="mb-3">
                        <h4 className="fw-bold mb-1">
                          Crypto Withdrawal Requests
                        </h4>
                        <p className="text-light mb-0" style={{ opacity: 0.7 }}>
                          Review and manage cryptocurrency withdrawal
                          transactions.
                        </p>
                      </div>

                      {/* Scrollable Table Container */}
                      <div
                        style={{
                          maxHeight: "400px",
                          overflowY: "auto",
                          borderRadius: "12px",
                        }}
                      >
                        <table className="table table-dark table-hover align-middle mb-0">
                          <thead
                            style={{
                              backgroundColor: "#0b1220",
                              position: "sticky",
                              top: 0,
                            }}
                          >
                            <tr className="text-uppercase small text-muted">
                              <th>ID</th>
                              <th>Amount</th>
                              <th>Wallet Address</th>
                              <th>Status</th>
                              <th>Email</th>
                              <th className="text-center">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {cryptoR.length >= 1 ? (
                              cryptoR.map((data) => (
                                <tr key={data._id}>
                                  <td className="fw-semibold">
                                    {data._id.slice(1, 12)}
                                  </td>

                                  <td className="fw-bold text-warning">
                                    ${data.amount}
                                  </td>

                                  <td
                                    className="text-light"
                                    style={{
                                      maxWidth: "220px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      opacity: 0.8,
                                    }}
                                    title={data.cryptoAddress}
                                  >
                                    {data.cryptoAddress}
                                  </td>

                                  <td>
                                    <span
                                      className={`badge ${
                                        data.status === "Approved"
                                          ? "bg-success"
                                          : data.status === "Declined"
                                            ? "bg-danger"
                                            : "bg-warning text-dark"
                                      }`}
                                    >
                                      {data.status}
                                    </span>
                                  </td>

                                  <td style={{ opacity: 0.8 }}>{data.email}</td>

                                  <td>
                                    <div className="d-flex gap-2 justify-content-center">
                                      <button
                                        onClick={() => handleShow4(data._id)}
                                        className="btn btn-outline-warning btn-sm rounded-3"
                                      >
                                        Decline
                                      </button>

                                      <button
                                        onClick={() => handleShow5(data._id)}
                                        className="btn btn-outline-success btn-sm rounded-3"
                                      >
                                        Approve
                                      </button>

                                      <button
                                        onClick={() => handleShow6(data._id)}
                                        className="btn btn-outline-danger btn-sm rounded-3"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="6"
                                  className="text-center py-4 text-light"
                                  style={{ opacity: 0.7 }}
                                >
                                  No crypto withdrawal records available.
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
      </div>
    </div>
  );
};

export default Admin;
