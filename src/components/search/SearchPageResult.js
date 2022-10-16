import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function SearchPageResult() {
  let { meal_id } = useParams();
  let navigate = useNavigate();
  let [restaurantList, setRestaurantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [filter, setFilter] = useState({ meal_type: meal_id });

  let getLocationList = async () => {
    try {
      let response = await axios.get("http://localhost:5003/api/get-loc-list");
      let data = response.data;
      if (data.status === true) {
        setLocationList([...data.result]); //recreating the array
      } else {
        setLocationList([]);
      }
      // console.log(data);
    } catch (error) {
      alert("server  error");
      console.log(error);
    }
  };

  // let { meal_id } = params;
  // console.log(meal_id);

  let filterOperation = async (filter) => {
    let URL = "http://localhost:5003/api/filter";
    // let filter = {
    //   meal_type: meal_id,
    // };
    try {
      let { data } = await axios.post(URL, filter);

      if (data.status === true) {
        setRestaurantList([...data.newResult]);
      } else {
      }
      // if (data.status === true) {
      // setRestaurantList([...data.result]);
      // }
      // console.log(response);
    } catch (error) {
      alert("server error");
      // console.log(error);
    }
  };
  // console.log(restaurantList);
  // console.log(locationList);

  let makeFiltration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter };

    switch (type) {
      case "location":
        if (Number(value > 0)) {
          _filter["location"] = Number(value);
        } else {
          delete _filter["location"];
        }
        break;

      case "cuisine":
        _filter["cuisine"] = Number(value);
        break;

      case "sort":
        _filter["sort"] = Number(value);
        break;

      case "cost-for-two":
        let costForTwo = value.split("-");

        // console.log(costForTwo);
        _filter["lcost"] = Number(costForTwo[0]);
        _filter["hcost"] = Number(costForTwo[1]);
        break;

      default:
        break;
    }

    // console.log(filter);
    console.log(_filter);
    setFilter({ ..._filter });
    filterOperation(_filter);
  };
  useEffect(() => {
    filterOperation(filter);
    getLocationList();
  }, []);

  return (
    <>
      {/* ======================== */}
      <section className="row d-flex justify-content-center">
        <div className="col-lg-10 col-12">
          <div>
            <p className="h1 search-page-title text-success fw-bold py-lg-4">
              Breakfast Places in Mumbai
            </p>
          </div>
          {/* <!-- filter section --> */}
          <div className="search-area">
            <div className="col-lg-3 col-12 p-4 shadow m-3">
              <div className="d-flex justify-content-between">
                <p className="fw-bold h4">Filter</p>
                <button
                  className="d-lg-none d-md-none btn"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-controls="collapseFilter"
                >
                  <span className="fa fa-eye"></span>
                </button>
                {/* collapse */}
              </div>
              {/* collapse start */}
              <div className="collapse show" id="collapseFilter">
                <p>Select Location</p>
                <div>
                  <select
                    name=""
                    id=""
                    className="form-select form-select-sm"
                    onChange={(event) => makeFiltration(event, "location")}
                  >
                    <option value="-1">Select a location</option>
                    {locationList.map((location, index) => {
                      return (
                        <option key={index} value={location.location_id}>
                          {location.name},{location.city}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div
                  className="mt-3 mb-4"
                  // onChange={(event) => makeFiltration(event, "cuisine")}
                  onChange={() => {}}
                >
                  <p className="h5">Cuisine</p>

                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="northIndian"
                      className="form-check-input"
                      value="1"
                      onChange={(event) => makeFiltration(event, "cuisine")}
                    />
                    <label htmlFor="northIndian" className="form-check-label">
                      North Indian
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="southIndian"
                      className="form-check-input"
                      value="2"
                      // onChange={(event) => makeFiltration(event, "cuisine")}
                      onChange={(event) => makeFiltration(event, "cuisine")}
                    />
                    <label htmlFor="southIndian" className="form-check-label">
                      South Indian
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="chinese"
                      className="form-check-input"
                      value="3"
                      onChange={(event) => makeFiltration(event, "cuisine")}
                    />
                    <label htmlFor="chinese" className="form-check-label">
                      Chinese
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="fastFood"
                      className="form-check-input"
                      value="4"
                      onChange={(event) => makeFiltration(event, "cuisine")}
                    />
                    <label htmlFor="fastFood" className="form-check-label">
                      Fast Food
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      name=""
                      id="streetFood"
                      className="form-check-input"
                      value="5"
                      onChange={(event) => makeFiltration(event, "cuisine")}
                    />
                    <label htmlFor="streetFood" className="form-check-label">
                      Street Food
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <p>Cost For Two</p>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      id="lt500"
                      value="0-500"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="lt500" className="form-check-label">
                      less than 500
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      id="500to1k"
                      value="500-1000"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="500to1k" className="form-check-label">
                      500-1000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      id="1kto1.5k"
                      value="1000-1500"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="1kto1.5k" className="form-check-label">
                      1000-1500
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      id="1.5kto2k"
                      value="1500-2000"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="1.5kto2k" className="form-check-label">
                      1500-2000
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="cost-for-two"
                      id="2k+"
                      value="2000-999999"
                      onChange={(event) =>
                        makeFiltration(event, "cost-for-two")
                      }
                    />
                    <label htmlFor="2k+" className="form-check-label">
                      2000+
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <p>Sort</p>
                  <div className="ms-1 form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="sort"
                      id="sort"
                      value="-1"
                      onChange={(event) => makeFiltration(event, "sort")}
                    />
                    <label htmlFor="sort" className="form-check-label">
                      High to Low
                    </label>
                  </div>
                  <div className="ms-1 form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="sort"
                      id="sorting"
                      value="1"
                      onChange={(event) => makeFiltration(event, "sort")}
                    />
                    <label htmlFor="sorting" className="form-check-label">
                      Low to High
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- search result --> */}
            <div className="search-result-area col-lg-8 col-12 d-flex flex-column justify-content-center align-items-center">
              {restaurantList.map((restaurant, index) => {
                return (
                  <div
                    key={index}
                    className="col-lg-11 shadow p-4 mb-4 border border-1"
                    onClick={() => navigate("/restaurant/" + restaurant._id)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={"/images/" + restaurant.image}
                        className="food-item-img"
                      />
                      <div className="ms-5">
                        <p className="h4 fw-bold">{restaurant.name}</p>
                        <span className="fw-bold text-muted">
                          {restaurant.city}
                        </span>
                        <p className="m-0 text-muted">
                          {restaurant.locality},{restaurant.city}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="d-flex">
                      <div>
                        <p className="m-0">CUISINES:</p>
                        <p className="m-0">COST FOR TWO:</p>
                      </div>
                      <div className="ms-5">
                        <p className="m-0 fw-bold">
                          {restaurant.cuisine.reduce((pVal, cVal) => {
                            return pVal.name + "," + cVal.name;
                          })}
                        </p>
                        <p className="m-0 fw-bold">
                          <i className="fa fa-inr" aria-hidden="true"></i>
                          {restaurant.min_price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pageignition">
                <ul className="d-flex">
                  <li className="fa fa-angle-left" />
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li className="fa fa-angle-right" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =================== */}
    </>
  );
}
export default SearchPageResult;

// let { meal_type, location, cuisine, hcost, lcost, sort, page }
