import { useNavigate, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";

const DeliveryNavbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Simulate fetching notifications
    if (user?.role === "delivery") {
      setTimeout(() => {
        setNotifications([
          { id: 1, message: "Order #123 delivered" },
          { id: 2, message: "New order assigned!" },
        ]);
      }, 1000);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // If not logged in, hide the navbar

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand
          as={Link}
          to={user.role === "delivery" ? "/delivery" : "/"}
        >
          {user.role === "delivery" ? "Delivery Dashboard" : "Food Delivery"}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {user.role === "delivery" && (
              <>
                <Nav.Link as={Link} to="/profile">
                  Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/history">
                  History
                </Nav.Link>
              </>
            )}
            {user.role === "customer" && (
              <Nav.Link as={Link} to="/orders">
                My Orders
              </Nav.Link>
            )}
            {user.role === "restaurant" && (
              <Nav.Link as={Link} to="/restaurant/orders">
                Incoming Orders
              </Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto">
            {user.role === "delivery" && (
              <Nav.Link onClick={() => alert("Open notification panel")}>
                <i className="bi bi-bell" style={{ fontSize: "1.2rem" }}></i>
                {notifications.length > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {notifications.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

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
