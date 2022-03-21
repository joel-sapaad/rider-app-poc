import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function ActiveClients() {
const [activeClients, setActiveClients] = useState([])

  useEffect(() => {
    const socket = io("/");
    socket.on("location_updated", (data) => {
      console.log("Client location updaated", data);
    });

    socket.on("client_subscribed", (data) => {
      console.log("Client Subscribed", data);
    });
  }, []);
  return <div>Active Clients
    {/* <div>{activeClients.map((client)=>{
      return(

      )
    })}</div> */}
  </div>;
}

export default ActiveClients;
