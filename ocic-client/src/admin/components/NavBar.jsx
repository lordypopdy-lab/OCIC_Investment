import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const NavBar = () => {
  const logout = async () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };
  return (
    <div>
      <Navbar
        expand="lg"
        fixed="top"
        className="shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          zIndex: 1050,
          padding: "0.5rem 1rem",
        }}
      >
        <Container fluid className="d-flex align-items-center">
          {/* Logo */}
          <Navbar.Brand
            href="/dashboard"
            className="d-flex align-items-center fw-bold text-white"
            style={{ fontSize: "20px", letterSpacing: "1px" }}
          >
            <img
              src="/img/logo_2.png"
              alt="logo"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                display: "inline-block",
                marginRight: "8px",
              }}
            />
            POPDY
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls="navbarScroll" className="border-0" />

          {/* Nav Links */}
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="ms-auto my-2 my-lg-0"
              navbarScroll
              style={{ maxHeight: "100px" }}
            >
              <Nav.Link
                href="/dashboard"
                className="text-white d-flex align-items-center px-3"
              >
                <i className="fas fa-user-circle me-2"></i>Account
              </Nav.Link>

              <Nav.Link
                href="/deposite"
                className="text-white d-flex align-items-center px-3"
              >
                <i className="fas fa-money-bill-wave me-2"></i>Deposit
              </Nav.Link>

              <Nav.Link
                href="/withdraw"
                className="text-white d-flex align-items-center px-3"
              >
                <i className="fas fa-hand-holding-usd me-2"></i>Withdraw
              </Nav.Link>

              <Nav.Link
                href="/settings"
                className="text-white d-flex align-items-center px-3"
              >
                <i className="fas fa-cog me-2"></i>Settings
              </Nav.Link>

              <Nav.Link
                href="/contact"
                className="text-white d-flex align-items-center px-3"
              >
                <i className="fas fa-question-circle me-2"></i>Support
              </Nav.Link>

              <Nav.Link
                href="#"
                onClick={logout}
                className="text-danger d-flex align-items-center px-3"
              >
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
