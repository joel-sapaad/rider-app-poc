import LiveTracking from "./components/liveTracking";
import SignIn from "./components/signIn";
import UserPermissionWatcher from "./containers/userPermissionsWatcher";

function App() {
  return (
    <div className="App">
      <UserPermissionWatcher>
        <LiveTracking />
      </UserPermissionWatcher>
    </div>
  );
}

export default App;
