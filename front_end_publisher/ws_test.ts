import { resolve } from "bun";
import { expect, test } from "bun:test";
const WS_URL = "ws://localhost:3000";

test("2 +2 ", () => {
  expect(2 + 2).toBe(4);
});

import { describe, it } from "bun:test";

test.skip("Opening Connection", async () => {
  const ws = new WebSocket(WS_URL);
  const messagePromise = new Promise((resolve) => {
    ws.addEventListener("message", (event) => {
      resolve(event.data);
    });
  });

  const message = await messagePromise;
  expect(message).toBe("SendMessage");
  ws.close();
});

test("Multiple Connections", async () => {
  const client1 = new WebSocket(WS_URL);
  const client2 = new WebSocket(WS_URL);
  const clients = [client1, client2];

  const connectionPromises = clients.map((client) => {
    return new Promise((resolve) => {
      client.addEventListener("open", (event) => {
        client.send("Hey");
        resolve("Connection Opened");
      });
    });
  });

  const messages = await Promise.all(connectionPromises);
  expect(messages).toBeArrayOfSize(2);
  clients.forEach((client) => {
    client.close();
  });
});

test("Get Books", async () => {
  const client1 = new WebSocket(WS_URL);
  const client2 = new WebSocket(WS_URL);
  const clients = [client1, client2];

  const connectionPromises = clients.map((client) => {
    return new Promise((resolve) => {
      const testData: any[] = [];
      client.addEventListener("open", (event) => {
        client.send("Hey");
        // resolve("Connection Opened");
      });

      client.addEventListener("message", (event) => {
        testData.push(event.data);

        if (testData.length > 203) {
          resolve(testData);
        }
      });
    });
  });

  const messages = await Promise.all(connectionPromises);
  expect(messages).toBeArrayOfSize(2);

  clients.forEach((client) => {
    client.close();
  });
});
