
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // for navigation

const SearchBar = () => {
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const keyword = e.target.q.value.trim();
    if (keyword) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex align-items-center">
      <Form.Control
        type="text"
        name="q"
        placeholder="Search Items..."
        className="me-2"
      />
      <Button type="submit" variant="outline-success">
        Search
      </Button>
    </Form>
  );
};

export default SearchBar; 
