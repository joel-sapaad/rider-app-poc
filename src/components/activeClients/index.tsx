import React, { useEffect, useState } from "react";
import { Button, Table } from "semantic-ui-react";
import { io } from "socket.io-client";

function ActiveClients() {
  const [activeClients, setActiveClients] = useState([] as any);

  useEffect(() => {
    const socket = io("/");
    socket.on("location_updated", (data) => {
      console.log("Client location updaated", data);
    });

    socket.on("client_subscribed", (data) => {
      console.log("Client Subscribed", data);
      setActiveClients([...activeClients, data]);
    });
  }, []);

  const sendNotification = (subscription: any) => {
    let payload = {
      subscription,
      message: {
        title: "New Order created",
        body: "Please come to the restaurant and collect order",
      },
    };
    fetch("/send_push", {
      method: "post",
      body: JSON.stringify(payload),
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        console.log("send push notification success");
      } else {
        console.log("send push notification failure");
      }
    });
  };

  return (
    <div>
      Active Clients
      <div>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Client auth</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {activeClients.map((client: any, index: number) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{client.keys.auth}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => sendNotification(client)}>
                      Send Push
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default ActiveClients;
