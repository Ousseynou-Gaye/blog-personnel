import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NouvelArticle from "./pages/NouvelArticle";
import DetailArticle from "./pages/DetailArticle";
import ModifierArticle from "./pages/ModifierArticle";
import Amis from "./pages/Amis";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/articles/nouveau" element={<NouvelArticle />} />
                <Route path="/articles/:id" element={<DetailArticle />} />
                <Route path="/articles/:id/modifier" element={<ModifierArticle />} />
                <Route path="/amis" element={<Amis />} />
            </Routes>
        </Router>
    );
}

export default App;