import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Swal from "sweetalert2";

function RestaurantPage() {
  let [tab, setTab] = useState(1);
  let { id } = useParams();

  let defaultValue = {
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "assets/drink2.png",
    locality: "",
    location_id: -1,
    mealtype_id: -1,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: -1,
  };

  let getTokenDetails = () => {
    //read the token data from localstorage
    let token = localStorage.getItem("auth-token");

    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };

  let [userDetails, setUserDetails] = useState(getTokenDetails());

  let [restaurant, setRestaurant] = useState({ ...defaultValue });
  let [menuItems, setMenuItems] = useState([]);
  let [totalPrice, setTotalPrice] = useState(0);

  let getRestDetail = async () => {
    try {
      let URL =
        "https://batch48-zclone-api-app.herokuapp.com/api/get-rest-details-by-id/" +
        id;

      let { data } = await axios.get(URL);
      if (data.status === true) {
        setRestaurant({ ...data.result });
      } else {
        setRestaurant({ ...defaultValue });
      }
    } catch (error) {
      alert("error is in server");
    }
  };

  let getMenuItems = async () => {
    try {
      let URL =
        "https://batch48-zclone-api-app.herokuapp.com/api/get-menu-items-by-rest-id/" +
        id;
      let { data } = await axios.get(URL);
      if (data.status === true) {
        setMenuItems([...data.result]);
      } else {
        setMenuItems([]);
      }
      setTotalPrice(0);
    } catch (error) {
      alert("server error");
    }
  };

  let addItemQty = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty += 1;

    let newPrice = _menuItems[index].price;
    setTotalPrice(totalPrice + newPrice);
    setMenuItems(_menuItems);
  };

  let removeItemQty = (index) => {
    let _menuItems = [...menuItems];
    _menuItems[index].qty -= 1;

    let newPrice = _menuItems[index].price;
    setTotalPrice(totalPrice - newPrice);
    setMenuItems(_menuItems);
  };

  async function loadScript() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }

  let displayRazorpay = async () => {
    let isLoaded = await loadScript();

    if (isLoaded === false) {
      alert("sdk is not loaded");
      return false;
    }
    let serverData = {
      amount: totalPrice,
    };
    let { data } = await axios.post(
      "https://batch48-zclone-api-app.herokuapp.com/api/payment/gen-order",
      serverData
    );
    var order = data.order;
    var options = {
      key: "rzp_test_DLycePJfzASmEE", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato clone payment",
      description: "buying a product from zomato clone",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      handler: async function (response) {
        var sendData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        var { data } = await axios.post(
          "https://batch48-zclone-api-app.herokuapp.com/api/payment/verify",
          sendData
        );

        console.log(data.status);

        if (data.status === false) {
          alert("Payment Failed");
        } else {
          // alert("Order placed");
          Swal.fire(
            "Congratulations",
            "Your order is placed Successfully !!",
            "success"
          ).then(() => {
            window.location.replace("/");
          });
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999",
      },
    };
    var razorpayObject = window.Razorpay(options);
    razorpayObject.open();
  };

  useEffect(() => {
    getRestDetail();
  }, []);
  return (
    <>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">
                {restaurant.name},{restaurant.locality}-{restaurant.city}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              {menuItems.map((menu_item, index) => {
                return (
                  <div className="row p-3" key={index}>
                    <div className="col-8 ps-4">
                      <p>{menu_item.name}</p>
                      <p>Rs. {menu_item.price} </p>
                      <p>{menu_item.description}</p>
                    </div>
                    <div className="col-4  d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/images/" + menu_item.image} alt="" />
                        {menu_item.qty === 0 ? (
                          <button
                            className="btn btn-primary btn-sm add"
                            onClick={() => addItemQty(index)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="order-item-count">
                            <span
                              className="hand"
                              onClick={() => removeItemQty(index)}
                            >
                              -
                            </span>
                            <span>{menu_item.qty}</span>
                            <span
                              className="hand"
                              onClick={() => addItemQty(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPrice > 0 ? (
              <div className="modal-footer d-flex justify-content-between">
                <h3>Total: {totalPrice} INR</h3>
                <button
                  className="btn btn-danger"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Proceed
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  placeholder="Enter your name"
                  value={userDetails.name}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id=""
                  placeholder="Enter email id"
                  value={userDetails.email}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  id=""
                  rows="3"
                  placeholder="Enter your address"
                  value=""
                  onChange={() => {}}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                className="btn btn-danger"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Go back
              </button>
              <button className="btn btn-success" onClick={displayRazorpay}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header color="bg-danger" />

      <section className="row justify-content-center ">
        <section className="col-10 restaurant-background position-relative">
          <img src={"/images/" + restaurant.image} alt="" />
          <button className="btn-gallery position-absolute">
            Click to see Image Gallery
          </button>
        </section>
        <section className="col-10">
          <h2 className="mt-3 fw-bold">{restaurant.name}</h2>
          <div className="d-flex justify-content-between align-items-start">
            <ul className="d-flex list-unstyled gap-3 fw-bold">
              <li className="pb-3 hand" onClick={() => setTab(1)}>
                Overview
              </li>
              <li className="pb-3 hand" onClick={() => setTab(2)}>
                Contact
              </li>
            </ul>
            {userDetails ? (
              <button
                data-bs-toggle="modal"
                href="#exampleModalToggle"
                role="button"
                className="btn btn-danger"
                onClick={getMenuItems}
              >
                Place Online Order
              </button>
            ) : (
              <button className="btn btn-danger " disabled={true}>
                Login to place Order
              </button>
            )}
          </div>

          {tab === 1 ? (
            <section>
              <h3 className="mb-3 ">About this place</h3>
              <p className="m-0 fw-bold">Cuisine</p>
              <p className="mb-3 text-muted small">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pVal, cVal) => {
                      return pVal.name + "," + cVal.name;
                    })
                  : null}
              </p>

              <p className="m-0 fw-bold">Average Cost </p>
              <p className="mb-3 text-muted small">
                ₹{restaurant.min_price} for two people (approx.)
              </p>
              <p className="m-0 fw-bold">Average ⭐ Rating </p>
              <p className="mb-3 text-muted small">
                {restaurant.aggregate_rating},{restaurant.rating_text}
              </p>
            </section>
          ) : (
            <section>
              <h3 className="mb-3 fw-bolder">Contact</h3>
              <p className="m-0 fw-normal">Phone Number</p>
              <p className="mb-3 text-danger small">
                +{restaurant.contact_number}
              </p>

              <p className="m-0 fw-bold">
                {restaurant.name}, {restaurant.locality},{restaurant.city}
              </p>
              <p className="mb-3 text-muted small">
                Shop 1, Plot D, Samruddhi Complex, Chincholi, Mumbai-400002,
                Maharashtra
              </p>
            </section>
          )}
        </section>
      </section>
    </>
  );
}
export default RestaurantPage;
