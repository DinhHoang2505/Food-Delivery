import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { token, getTotalCartAmount, food_list, cartItems, url } = useContext(StoreContext)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    event.preventDefault();
    const name = event.target.name
    const value = event.target.value
    setData({ ...data, [name]: value })
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }
    let response = await axios.post(url + '/api/order/place', orderData, { headers: { token } })
    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url)
    } else {
      alert("Error");
    }
  }


  useEffect(() => {
    if (!token) {
      navigate("/cart")
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart")
    }
  }, [token])


  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.firstName} name="firstName" type="text" placeholder="First name" />
          <input required onChange={onChangeHandler} value={data.lastName} name="lastName" type="text" placeholder="Last name" />
        </div>

        <input required onChange={onChangeHandler} value={data.email} name="email" type="email" placeholder="Email address" />
        <input required onChange={onChangeHandler} value={data.street} name="street" type="text" placeholder="Street" />

        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.city} name="city" type="text" placeholder="City" />
          <input required onChange={onChangeHandler} value={data.state} name="state" type="text" placeholder="State" />
        </div>

        <div className="multi-fields">
          <input required onChange={onChangeHandler} value={data.zipcode} name="zipcode" type="text" placeholder="Zip code" />
          <input required onChange={onChangeHandler} value={data.country} name="country" type="text" placeholder="Country" />
        </div>

        <input required onChange={onChangeHandler} value={data.phone} name="phone" type="text" placeholder="Phone" />

      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Carts Total</h2>
          <div className="cart-total-details">
            <p>SubTotal</p>
            <b>${getTotalCartAmount()}</b>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <b>${getTotalCartAmount() === 0 ? 0 : 2}</b>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Total</p>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button
            onClick={() => navigate('/order')}
            type="submit"
          >PROCEED TO PAYMENT</button>
        </div>
      </div>

    </form>
  );
};

export default PlaceOrder;
