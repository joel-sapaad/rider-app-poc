import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ActiveClients from "./components/activeClients";
import LiveTracking from "./components/liveTracking";
import SignIn from "./components/signIn";
import HomeScreen from "./containers/homeScreen";
import UserPermissionWatcher from "./containers/userPermissionsWatcher";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <UserPermissionWatcher>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/dmms" element={<ActiveClients />} />
            </Routes>
          </BrowserRouter>
        </UserPermissionWatcher>
      </div>
    </Provider>
  );
}

export default App;
