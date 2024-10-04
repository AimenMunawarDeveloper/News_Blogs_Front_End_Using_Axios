import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "../src/pages/Home/Components/Home";
import News from "../src/pages/Categories/Components/Categories";
import Categories from "../src/pages/News/Components/News";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/news" element={<News />}></Route>
          <Route exact path="/categories" element={<Categories />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
