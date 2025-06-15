import { Route, Routes } from "react-router";
import { FaCalendar, FaHome } from "react-icons/fa";
import "./App.css";
import CalenderPage from "./components/Calender/CalenderPage";
import NavMenu from "./components/UI/NavMenu";
import KanbanPage from "./components/Kanban/KanbanPage";
import { MdOutlineTaskAlt } from "react-icons/md";
import HomePage from "./components/Home/HomePage";

function App() {
  return (
    <main className=" py-4 h-screen flex items-center w-[1290px] mx-auto">
      <nav className="flex flex-col border-[0.5px]  p-2 rounded-lg justify-center mr-4 h-[300px] gap-y-2">
        <NavMenu to="/">
          <FaHome />
        </NavMenu>
        <NavMenu to="/calender">
          <FaCalendar />
        </NavMenu>
        <NavMenu to="/kanban">
          <MdOutlineTaskAlt />
        </NavMenu>
      </nav>

      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="calender" element={<CalenderPage />} />
        <Route path="kanban" element={<KanbanPage />} />
      </Routes>
    </main>
  );
}

export default App;
