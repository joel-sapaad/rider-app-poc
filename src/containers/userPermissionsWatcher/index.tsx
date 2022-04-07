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

  const [serviceWorkerSupport, setServiceWorkerSupport] = useState(false);
  const [pushApiSupport, setPushApiSupport] = useState(false);

  useEffect(() => {
    setNotificationSupport(() => {
      const isNotificationSupported = "Notification" in window;
      if (isNotificationSupported) {
        requestNotificationPermission();
      }
      return isNotificationSupported;
    });

    setLocationSupport(() => {
      const isGeolocationSupported = "geolocation" in navigator;
      if (isGeolocationSupported) {
        requestLocationPermission();
      }
      return isGeolocationSupported;
    });

    setServiceWorkerSupport("serviceWorker" in navigator);
    setPushApiSupport("PushManager" in window);
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition((location) => {
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ lat: latitude, lon: longitude });
    });
  };

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    if ("permissions" in navigator) {
      // Using Permission API
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationLoading(false);
        setLocationStatus(result.state);
        if (result.state === "prompt") {
          setLocationLoading(true);
          navigator.geolocation.getCurrentPosition(updateCurrentLocation);
        }
        result.onchange = () => {
          setLocationStatus(result.state);
        };
      });
    } else {
      // Using Geolocation API (fallback)
      navigator.geolocation.getCurrentPosition(updateCurrentLocation);
    }
  };

  const updateCurrentLocation = (location: any) => {
    const { latitude, longitude } = location.coords;
    setLocationStatus("granted");
    setCurrentLocation({ lat: latitude, lon: longitude });
    setLocationLoading(false);
  };

  const requestNotificationPermission = async () => {
    if ("permissions" in navigator) {
      // Using Permission API
      setNotificationLoading(true);
      navigator.permissions.query({ name: "notifications" }).then((result) => {
        setNotificationLoading(false);
        setNotificationStatus(result.state);
        if (result.state === "prompt") {
          requestNotifyPermission();
        }
        result.onchange = () => {
          setNotificationStatus(result.state);
        };
      });
    } else {
      // Using Notification API
      requestNotifyPermission();
    }
  };

  const requestNotifyPermission = async () => {
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

  return locationStatus === "granted" ? (
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
              : "Waiting for user confirmation. If skipped, check site permissions in browser preferences"}
            <p>
              {pushApiSupport
                ? `✅ Can subscribe to push notifications${
                    notificationStatus !== "granted" ? " if enabled." : "."
                  }`
                : "❌ Cannot receive notifications. Browser not supported"}
            </p>
            <p>
              {serviceWorkerSupport && pushApiSupport
                ? `✅ Can receive push notifications in background${
                    notificationStatus !== "granted" ? " if enabled." : "."
                  }`
                : "❌ Cannot receive notifications in background"}
            </p>
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
              : "Waiting for user confirmation. If skipped/denied, check site permissions in browser preferences"}
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
