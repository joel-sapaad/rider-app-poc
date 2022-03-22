import React from "react";
import { useSelector } from "react-redux";
import LiveTracking from "../../components/liveTracking";
import SignIn from "../../components/signIn";
import { RootState } from "../../redux/store";

function HomeScreen() {
  let user = useSelector((state: RootState) => state.user);
  return !user.email ? <SignIn /> : <LiveTracking />;
}

export default HomeScreen;
