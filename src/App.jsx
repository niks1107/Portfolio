import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio";
import Admin from "./Admin";
import Filmmaking from "./Filmmaking";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/filmmaking" element={<Filmmaking />} />
      </Routes>
    </BrowserRouter>
  );
}
