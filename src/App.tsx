import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import AppShell from "./components/AppShell";

// Pages
import Home from "./pages/Home";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import Proof from "./pages/Proof";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Landing - No Shell */}
                <Route path="/" element={<Home />} />

                {/* Protected / App routes - With Top Nav Shell */}
                <Route element={<AppShell />}>
                    <Route path="/builder" element={<Builder />} />
                    <Route path="/preview" element={<Preview />} />
                    <Route path="/proof" element={<Proof />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
