import { BrowserRouter, Route, Routes } from "react-router-dom";
import ActiveClients from "./components/activeClients";
import LiveTracking from "./components/liveTracking";
import SignIn from "./components/signIn";
import UserPermissionWatcher from "./containers/userPermissionsWatcher";

function App() {
  return (
    <div className="App">
      <UserPermissionWatcher>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LiveTracking />} />
            <Route path="/dmms" element={<ActiveClients />} />
          </Routes>
        </BrowserRouter>
      </UserPermissionWatcher>
    </div>
  );
}

export default App;
