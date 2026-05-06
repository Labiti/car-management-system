import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout, isAdmin, isManager } = useAuth();
    const navigate = useNavigate();

    const getRoleBadge = () => {
        const colors = {
            employee: 'info',
            manager: 'warning',
            fleet_admin: 'danger',
            super_admin: 'dark',
        };
        return <Badge bg={colors[user?.role]}>{user?.role}</Badge>;
    };

    return (
        <Container fluid className="py-4 bg-light" style={{ minHeight: '100vh' }}>
            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1 className="display-5 fw-bold text-primary">Dashboard</h1>
                        <p>Welcome back, {user?.first_name || user?.username}!</p>
                    </Col>
                    <Col className="text-end">
                        <Button variant="outline-danger" onClick={logout}>Logout</Button>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h4>Profile Information</h4>
                                <hr />
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Username:</strong> {user?.username}</p>
                                        <p><strong>Email:</strong> {user?.email}</p>
                                        <p><strong>Full Name:</strong> {user?.first_name} {user?.last_name}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Role:</strong> {getRoleBadge()}</p>
                                        <p><strong>Department:</strong> {user?.department || 'Not assigned'}</p>
                                        <p><strong>Employee ID:</strong> {user?.employee_id || 'Not assigned'}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Card className="shadow-sm text-center">
                            <Card.Body>
                                <h2>🚗</h2>
                                <h5>Request a Car</h5>
                                <p>Book a company car for your trip</p>
                                <Button variant="primary">Request Now</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm text-center">
                            <Card.Body>
                                <h2>📅</h2>
                                <h5>My Bookings</h5>
                                <p>View your upcoming and past bookings</p>
                                <Button variant="primary">View Bookings</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="shadow-sm text-center">
                            <Card.Body>
                                <h2>📊</h2>
                                <h5>Analytics</h5>
                                <p>View usage statistics and reports</p>
                                <Button variant="primary">View Reports</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {(isAdmin || isManager) && (
                    <Row className="mt-4">
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-primary text-white">
                                    <h5 className="mb-0">Admin Panel</h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={3}>
                                            <Button variant="outline-primary" className="w-100" onClick={() => navigate('/admin/users')}>
                                                Manage Users
                                            </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant="outline-primary" className="w-100">
                                                Manage Cars
                                            </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant="outline-primary" className="w-100">
                                                View Reports
                                            </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant="outline-primary" className="w-100">
                                                Maintenance
                                            </Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
};

export default Dashboard;