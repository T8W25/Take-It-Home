

// export default PostItem;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function PostItem() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [condition, setCondition] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    // Check for JWT token after component mounts
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        console.log("JWT Token Retrieved (PostItem):", token); // Debug log
        if (!token) {
            setMessage({ type: "danger", text: "You must be logged in to post an item" });
            navigate("/login"); // Redirect to login page if no token is found
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation for empty fields
        if (!title || !category || !condition || !description || !image) {
            setMessage({ type: "danger", text: "All fields are required" });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("itemName", title);
            formData.append("category", category);
            formData.append("condition", condition);
            formData.append("description", description);
            formData.append("image", image);

            const token = localStorage.getItem("jwtToken");
            if (!token) {
                setMessage({ type: "danger", text: "You must be logged in to post an item" });
                navigate("/login"); // Redirect to login page if no token is found
                return;
            }

            const response = await axios.post("http://localhost:3000/api/tradeitems/post", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage({ type: "success", text: response.data.message });

            // Reset fields after submission
            setTitle("");
            setCategory("");
            setCondition("");
            setDescription("");
            setImage(null);
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            setMessage({ type: "danger", text: error.response?.data?.message || "An error occurred" });
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col xs={12} md={6}>
                    <h2 className="text-center mb-4">Post a Trade Item</h2>

                    {message && <Alert variant={message.type}>{message.text}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        {/* Item Name */}
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter item name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Category */}
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Books">Books</option>
                                <option value="Sports">Sports</option>
                            </Form.Control>
                        </Form.Group>

                        {/* Condition */}
                        <Form.Group className="mb-3">
                            <Form.Label>Condition</Form.Label>
                            <Form.Control
                                as="select"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                required
                            >
                                <option value="">Select Condition</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                                <option value="Refurbished">Refurbished</option>
                            </Form.Control>
                        </Form.Group>

                        {/* Description */}
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter item description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Upload Image */}
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </Form.Group>

                        {/* Submit Button */}
                        <Button variant="primary" type="submit" className="w-100">
                            Post Item
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default PostItem;
