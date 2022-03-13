import { useEffect, useState } from "react";
import { Card, Icon, Message } from "semantic-ui-react";
import { IUserPermissionWatcherProps } from "./types";

const UserPermissionWatcher = (props: IUserPermissionWatcherProps) => {
  const [notificationSupport, setNotificationSupport] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    setNotificationSupport("Notification" in window);
  }, []);

  useEffect(() => {
    if (notificationSupport) {
      setNotificationLoading(true);
      Notification.requestPermission()
        .then((value) => {
          setNotificationLoading(false);
          setNotificationStatus(value);
        })
        .catch((error) => {
          setNotificationLoading(false);
        });
    }
  }, [notificationSupport]);

  return notificationStatus !== "granted" && !notificationSupport ? (
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
          icon={"location arrow"}
          header="Location"
          content="Location disabled by user"
        />
      </div>
    </div>
  );
};
export default UserPermissionWatcher;
