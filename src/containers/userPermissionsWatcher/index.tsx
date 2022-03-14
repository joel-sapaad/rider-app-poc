import { useEffect, useState } from "react";
import { Button, Icon, Message } from "semantic-ui-react";
import { IUserPermissionWatcherProps } from "./types";

const UserPermissionWatcher = (props: IUserPermissionWatcherProps) => {
  const [notificationSupport, setNotificationSupport] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [locationSupport, setLocationSupport] = useState(false);
  const [locationStatus, setLocationStatus] = useState("default");
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lon: 0 });

  useEffect(() => {
    setNotificationSupport("Notification" in window);
    setLocationSupport(
      "geolocation" in navigator && "permissions" in navigator
    );
  }, []);

  useEffect(() => {
    if (locationSupport) {
      setLocationLoading(true);
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            setLocationStatus(result.state);
            setLocationLoading(false);
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            setLocationLoading(true);
            navigator.permissions;
            navigator.geolocation.getCurrentPosition((location) => {
              setLocationLoading(false);
            });
          } else if (result.state === "denied") {
            setLocationLoading(false);
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            setLocationLoading(false);
            setLocationStatus(result.state);
          };
        });
    }
  }, [locationSupport]);

  useEffect(() => {
    if (notificationSupport) {
      requestNotificationPermission();
    }
  }, [notificationSupport]);

  const requestLocation = () => {
    navigator.permissions;
    navigator.geolocation.getCurrentPosition((location) => {
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ lat: latitude, lon: longitude });
    });
  };

  const requestNotificationPermission = async () => {
    setNotificationLoading(true);
    await Notification.requestPermission()
      .then((value) => {
        console.log(value);
        setNotificationLoading(false);
        setNotificationStatus(value);
      })
      .catch((error) => {
        setNotificationLoading(false);
      });
  };

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
          positive={locationSupport && locationStatus === "granted"}
          warning={locationSupport && locationStatus !== "granted"}
          negative={!locationSupport}
          icon
        >
          <Icon
            name={locationLoading ? "circle notch" : "location arrow"}
            loading={locationLoading}
          />
          <Message.Content>
            <Message.Header>{"Geolocation"}</Message.Header>
            {!locationSupport
              ? "This browser does not support getting user's location"
              : locationStatus === "granted"
              ? "Location permission has been allowed by user"
              : locationStatus === "granted"
              ? "Location permission denied by user"
              : "Waiting for user confirmation. If skipped/denied, check site settings in browser settings"}
            <br />
            {locationStatus === "granted" && (
              <>
                <Button size="small" icon onClick={requestLocation}>
                  <Icon name="location arrow" /> Request Location
                </Button>{" "}
                {currentLocation.lat > 0
                  ? `${currentLocation.lat},${currentLocation.lon}`
                  : " "}
              </>
            )}
          </Message.Content>
        </Message>
      </div>
    </div>
  );
};
export default UserPermissionWatcher;
