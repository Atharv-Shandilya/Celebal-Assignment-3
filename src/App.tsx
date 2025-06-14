import { NavLink, Route, Routes } from "react-router";
import { FaCalendar, FaHome } from "react-icons/fa";
import "./App.css";
import CalenderPage from "./components/Calender/CalenderPage";
import NavMenu from "./components/UI/NavMenu";

function App() {
  return (
    <main className="p-5 h-screen flex items-center">
      <nav className="flex flex-col border-[0.5px]  p-2 rounded-lg justify-center mr-4 h-[300px] gap-y-2">
        <NavMenu to="/">
          <FaHome />
        </NavMenu>
        <NavMenu to="/calender">
          <FaCalendar />
        </NavMenu>
      </nav>

      <Routes>
        <Route path="calender" element={<CalenderPage />} />
      </Routes>
    </main>
  );
}

export default App;
