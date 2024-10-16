import React, { useState } from 'react';
import axios from 'axios';

const CheckoutPage = () => {
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    payment: '',
  });

  const handleChange = (e) => {
    setOrderDetails({ ...orderDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/checkout', orderDetails);
    alert(`Order successful! Your order number: ${res.data.orderNumber}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Complete Your Purchase</h2>
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input name="address" placeholder="Shipping Address" onChange={handleChange} required />
      <input name="payment" placeholder="Payment Info" onChange={handleChange} required />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CheckoutPage;
