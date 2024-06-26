const ws = new WebSocket("ws://localhost:3000/ws");
ws.onmessage = (event) => {
  console.log(event.data);
};
