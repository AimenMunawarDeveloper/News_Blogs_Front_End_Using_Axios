import Home from "./pages/Home";
import News from "./pages/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/news" element={<News />}></Route>
        </Routes>
      </div>
    </Router>
  );
}
export default App;
