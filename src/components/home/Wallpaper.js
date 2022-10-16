import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "../Header";

function Wallpaper() {
  // let selctInput = useRef(); //it will give an element reference

  let [locationList, setLocationList] = useState([]);
  let [disabled, setDisabled] = useState(true);
  let getLocationList = async () => {
    try {
      let response = await axios.get(
        "https://batch48-zclone-api-app.herokuapp.com/api/get-loc-list"
      );

      let data = response.data;
      if (data.status === true) {
        setLocationList([...data.result]); //recreating the array
      } else {
        setLocationList([]);
      }
    } catch (error) {
      alert("server  error");
      console.log(error);
    }
  };

  let getLocationId = async (event) => {
    let value = event.target.value;
    // console.log(value);
    if (value !== "") {
      try {
        let url =
          "https://batch48-zclone-api-app.herokuapp.com/api/get-rest-by-loc-id/" +
          value;
        let { data } = await axios.get(url);

        if (data.status === true) {
          if (data.result.length == 0) {
            setDisabled(true);
          } else {
            setDisabled(false);
          }
        }
      } catch (error) {
        console.log(error);
        alert("server error");
      }
    }

    // if (value !== "") {
    //   setDisabled(false);
    // } else {
    //   setDisabled(true);
    // }
  };

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <>
      <section className="row main-section d-flex justify-content-center">
        <Header color="" />

        <div className="col-12"></div>
        <div className="col-12 d-flex flex-column align-items-center justify-content-center">
          <h1 className="brand-logo border d-flex align-items-center justify-content-center">
            e!
          </h1>
          <p className="title text-white fw-bold h1 my-3 text-center">
            Find the best restaurants, cafés, and bars
          </p>
        </div>
        <div className="col-lg-6 search-area d-flex justify-content-center align-items-center">
          <section className="search d-flex w-100">
            <div className="location-search w-50 me-3">
              <select
                // ref={selctInput}
                className="form-control py-3 px-4"
                onChange={getLocationId}
              >
                <option value="">Please select a location</option>
                {locationList.map((location, index) => {
                  return (
                    <option key={index} value={location.location_id}>
                      {location.name},{location.city}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="restaurant-search w-100">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fa fa-search text-muted p-2"></i>
                </span>
                <input
                  type="text"
                  name=""
                  id=""
                  className="form-control py-3"
                  placeholder="Please type a location"
                  disabled={disabled}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default Wallpaper;
