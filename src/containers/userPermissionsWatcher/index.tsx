import { useEffect, useState } from "react";
import { Button, Card, Icon, Message } from "semantic-ui-react";
import { IUserPermissionWatcherProps } from "./types";

const UserPermissionWatcher = (props: IUserPermissionWatcherProps) => {
  const [notificationSupport, setNotificationSupport] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [locationSupport, setLocationSupport] = useState(false);
  const [locationStatus, setLocationStatus] = useState("default");

  useEffect(() => {
    setNotificationSupport("Notification" in window);
    setLocationSupport("geolocation" in navigator);
  }, []);

  useEffect(() => {
    if (locationSupport) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            setLocationStatus(result.state);
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            navigator.permissions;
            navigator.geolocation.getCurrentPosition((location) => {});
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            setLocationStatus(result.state);
          };
        });
    }
  }, [locationSupport]);

  useEffect(() => {
    if (notificationSupport) {
      setNotificationLoading(true);
      Notification.requestPermission()
        .then((value) => {
          console.log(value);
          setNotificationLoading(false);
          setNotificationStatus(value);
        })
        .catch((error) => {
          setNotificationLoading(false);
        });
    }
  }, [notificationSupport]);

  return notificationSupport &&
    notificationStatus === "granted" &&
    locationStatus === "granted" ? (
    <>{props.children}</>
  ) : (
    <div className="user-permission-container">
      <h1>User Permissions</h1>

      <div className="permissions-wrapper">
        <Message
          positive={notificationSupport && notificationStatus === "granted"}
          warning={notificationSupport && notificationStatus !== "granted"}
          negative={!notificationSupport}
          icon
        >
          <Icon
            name={notificationLoading ? "circle notched" : "mobile alternate"}
            loading={notificationLoading}
          />
          <Message.Content>
            <Message.Header>{"Browser Notifications"}</Message.Header>
            {!notificationSupport
              ? "This browser does not support push notifications"
              : notificationStatus === "granted"
              ? "Notifications are enabled."
              : notificationStatus === "denied"
              ? "Notification permission is blocked by user. Please enable them from browser settings"
              : "Waiting for user confirmation. If skipped, check site settings in browser settings"}
          </Message.Content>
        </Message>
        <Message
          negative
          positive={locationSupport && locationStatus === "granted"}
          icon={"location arrow"}
          header="Location"
          content="Location disabled by user"
        />
      </div>
    </div>
  );
};
export default UserPermissionWatcher;
