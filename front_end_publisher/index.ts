type Author = {
  key: string | null;
  name: string | null;
};

type Book = {
  key: string;
  title: string;
  cover_id: number;
  subject: string[];
  authors: Author[];
};

// !TODO Create  a server !!use websockets
// 1.- Read JSON file with request
// -- Create a function the reads the request
// 2.- Post Request
// 3.- Do it once and maybe increase the amount of request to see
// How the programming languages perform
//

const data_to_send = Bun.file("data.json", { type: "application/json" });

const contents: Book[] = await data_to_send.json();

console.log("Hello via Bun!");

const server = Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log("Opened new connection!");
      const test_socket = "test_suite";

      ws.subscribe(test_socket);
    },

    message(ws, message) {
      console.log(`We received message ${message}`);

      if (message == "Init") {
        return;
      }
      const test_socket = "test_suite";

      contents.forEach((book) => {
        server.publish(test_socket, JSON.stringify(book));
      });

      console.log(`Data sent was ${contents.length}`);
      // server.publish(test_socket, "We are here");
    },

    close(ws) {
      console.log("We are closing connection");
      const test_socket = "test_suite";
      const msg = " We are closing connections";
      ws.unsubscribe(test_socket);
      server.publish(test_socket, msg);
    },
  },
});

console.log(`Listeninig on ${server.hostname}:${server.port}`);
