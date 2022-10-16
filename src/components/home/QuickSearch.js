import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuickSearch() {
  let [mealTypeList, setMealTypeList] = useState([]);
  let navigate = useNavigate("/"); //instance

  let getMealType = async () => {
    try {
      let response = await axios.get(
        "https://batch48-zclone-api-app.herokuapp.com/api/get-meal-types"
      );
      let data = response.data;

      if (data.status === true) {
        setMealTypeList([...data.result]); //recreating the array
      } else {
        setMealTypeList([]);
      }
      // console.log(data);
    } catch (error) {
      alert("server side error");
    }
  };

  let getQuickSearchPage = (id) => {
    navigate("/search-page/" + id);
  };
  useEffect(() => {
    getMealType();
  }, []);

  // console.log(mealTypeList);
  return (
    <>
      <section className="row quick-search-section d-flex justify-content-center">
        <div className="col-lg-10 col-11 my-4 p-lg-5 pb-lg-0">
          <h2 className="fw-bolder quick-search-title navy">Quick Searches</h2>
          <p className="quick-search-subtitle fs-4 text-muted">
            Discover restaurants by type of meal
          </p>
        </div>

        {/* <!-- search-items section --> */}
        <div className="col-lg-10 col-11 quick-search-area d-lg-flex justify-content-evenly flex-wrap">
          {mealTypeList.map((mealType, index) => {
            return (
              <section
                key={index}
                className="quick-search-item col-3 d-flex me-1 mb-3"
                onClick={() => getQuickSearchPage(mealType.meal_type)}
              >
                <img
                  src={"./images/" + mealType.image}
                  alt="breakfast"
                  srcSet=""
                  className="search-item-img"
                />
                <div className="p-3">
                  <h3 className="px-1 navy fw-bold">{mealType.name}</h3>
                  <p className="px-1 text-muted">{mealType.content}</p>
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default QuickSearch;
