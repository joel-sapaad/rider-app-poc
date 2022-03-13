import { useEffect, useState } from "react";
import { IUserPermissionWatcherProps } from "./types";

const UserPermissionWatcher = (props: IUserPermissionWatcherProps) => {
  const [notificationSupport, setNotificationSupport] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("default");

  useEffect(() => {
    setNotificationSupport("Notification" in window);
  }, []);

  useEffect(() => {
    if (notificationSupport) {
      Notification.requestPermission()
        .then((value) => {
          setNotificationStatus(value);
          console.log(value);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [notificationSupport]);

  return notificationStatus === "granted" && notificationSupport ? (
    <>{props.children}</>
  ) : (
    <div>
      <p>Is notification Supported? {notificationSupport ? "YES" : "NO"}</p>
      <p>
        Is notification granted?{" "}
        {notificationStatus === "granted"
          ? "YES"
          : notificationStatus === "denied"
          ? "Nope. pls check site settings."
          : "You skipped the request! :< Pls check site settings"}
      </p>
    </div>
  );
};
export default UserPermissionWatcher;
