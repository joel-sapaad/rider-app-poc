import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Form } from "semantic-ui-react";
import { io } from "socket.io-client";
import { publicVapidKey, urlBase64ToUint8Array } from "../../helpers/functions";
import { setUser, setUserSubscription } from "../../redux/features/user/userSlice";

function SignIn() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [websocket, setWebSocket] = useState(null as any);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("/");
    setWebSocket(socket)
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    subscribeToPushNotify()
    console.log("hello");
  };

  const subscribeToPushNotify = async () => {
    dispatch(setUser(userEmail));
    dispatch(setUserSubscription({}));
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.getRegistration().then((reg) => console.log(reg));
      const register = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("service worker register", register);
      register.pushManager.getSubscription().then((subs) => {
        console.log(subs);
      });
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });
      fetch("/subscribe", {
        method: "post",
        body: JSON.stringify({ email: userEmail }),
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          websocket.emit("subscribe", {
            user: { email: userEmail },
            subscription,
          });
          dispatch(setUser(userEmail));
          dispatch(setUserSubscription(subscription));
          console.log("Success");
        } else {
          console.log("fail");
        }
      });
    } else {
      console.log("not supported");
    }
  };

  return (
    <Card centered className="signin-form">
      <Card.Header className="header">
        <h1>Sign In</h1>
      </Card.Header>
      <Card.Content>
        <Form onSubmit={handleFormSubmit}>
          <Form.Field>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Field>
          <button className="ui button" type="submit">
            Sign In
          </button>
        </Form>
      </Card.Content>
    </Card>
  );
}

export default SignIn;
