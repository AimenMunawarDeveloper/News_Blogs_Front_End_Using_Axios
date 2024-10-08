import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "../src/pages/Home/components/Home";
import News from "../src/pages/News/components/News";
import Categories from "../src/pages/Categories/components/Categories";
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
