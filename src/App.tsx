import SignIn from "./components/signIn";
import UserPermissionWatcher from "./containers/userPermissionsWatcher";

function App() {
  return (
    <div className="App">
      <UserPermissionWatcher>
        <SignIn />
      </UserPermissionWatcher>
    </div>
  );
}

export default App;
