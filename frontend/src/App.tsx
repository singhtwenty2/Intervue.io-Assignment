import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Notification } from "./components/common/Notification";
import { Home } from "./pages/Home";
import { KickedOut } from "./pages/KickedOut";
import { StudentPage } from "./pages/StudentPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/teacher" element={<TeacherDashboard />} />
                        <Route path="/student" element={<StudentPage />} />
                        <Route path="/kicked-out" element={<KickedOut />} />
                    </Routes>
                    <Notification />
                </div>
            </Router>
        </Provider>
    );
}

export default App;
