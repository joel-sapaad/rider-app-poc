import { Button } from "semantic-ui-react";
import { urlBase64ToUint8Array } from "../../helpers/functions";
import { io } from "socket.io-client";
import { useEffect } from "react";

const publicVapidKey =
  "BJGUs6kqYmPtYX-808hWBIgYvzhNyjYP4_MMIKTqPQaTPL1Kf-CvKMeq1oE6RTgcFG6Jc2SzBl_1OrDelkroDdo";

const LiveTracking = () => {
  let webSocket: any;
  useEffect(() => {
    const socket = io("/");
    let watchPos: any
    socket.on("connection",()=>{
      watchPos = navigator.geolocation.watchPosition(
        (data) => {
          console.log("Location updated in client");
          socket.emit("location_updated", data.coords);
        },
        (err) => console.log(err),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
      );
    })
    webSocket = socket;
    return () => navigator.geolocation.clearWatch(watchPos)
  }, []);

  const subscribeToPushNotify = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const register = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      fetch("/subscribe", {
        method: "post",
        body: JSON.stringify(subscription),
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          webSocket.emit("subscribe", subscription);
          console.log("Success");
        } else {
          console.log("fail");
        }
      });
    } else {
      //
    }
  };

  //

  return (
    <div>
      <Button onClick={subscribeToPushNotify}>
        Subscribe to notifications
      </Button>
    </div>
  );
};

export default LiveTracking;
