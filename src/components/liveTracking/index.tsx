import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const LiveTracking = () => {
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {

  }, []);
  return (
    <div>
      <h1>Welcome {user.email}</h1>
      <h2>Live tracking test</h2>
    </div>
  );
};

export default LiveTracking;
