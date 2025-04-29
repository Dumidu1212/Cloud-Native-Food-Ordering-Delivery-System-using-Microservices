import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

const DeliveryNavbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Dummy notification loader
  useEffect(() => {
    // Simulate fetching notifications from backend
    setTimeout(() => {
      setNotifications([
        { id: 1, message: "Order #123 delivered" },
        { id: 2, message: "New order assigned!" },
      ]);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/delivery/home">
          Delivery Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="delivery-navbar-nav" />
        <Navbar.Collapse id="delivery-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/delivery/profile">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/delivery/history">
              History
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {/* Notifications button */}
            <Nav.Link onClick={() => alert("Open notification panel")}>
              <i className="bi bi-bell" style={{ fontSize: "1.2rem" }}></i>
              {notifications.length > 0 && (
                <Badge bg="danger" pill className="ms-1">
                  {notifications.length}
                </Badge>
              )}
            </Nav.Link>

            {/* Logout */}
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DeliveryNavbar;
