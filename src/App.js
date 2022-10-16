import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home/HomePage";
import RestaurantPage from "./components/restaurant/RestaurantPage";
import SearchPage from "./components/search/SearchPage";
import "./css/index.css";

function App() {
  return (
    <>
      <main className="container-fluid">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search-page/:meal_id" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
