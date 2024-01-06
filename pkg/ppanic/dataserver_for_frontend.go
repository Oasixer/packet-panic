package ppanic

import (
	// "encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
      return true // Allow connections from any origin
    },
}

// func main() { // TODO: ??? what is this
// }

func DataServer(infoUpdateQ chan InfoUpdate) error{
  var handleConnections = func(w http.ResponseWriter, r *http.Request) {
    // Upgrade initial GET request to a websocket
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatal(err)
    }
    defer ws.Close()

    for {
      infoUpdate := <- infoUpdateQ
      // Send a JSON object every second
      // jsonMessage, err := json.Marshal(infoUpdate)
      if err != nil {
        log.Printf("error calling json.Marshal to json-string-encode infoUpdate: %v\n", err)
        return
      }
      err = ws.WriteJSON(infoUpdate)
      if err != nil {
        log.Printf("error: %v", err)
        break
      }
      time.Sleep(10 * time.Millisecond) // TODO: determine proper sleep interval
    }
  }
  http.HandleFunc("/ws", handleConnections)
  // ListenAndServe listens on the TCP network address addr and then calls
  // Serve with handler to handle requests on incoming connections.
  // Accepted connections are configured to enable TCP keep-alives.
  //
  // The handler is typically nil, in which case the DefaultServeMux is used.
  http.ListenAndServe(":8080", nil)
  return nil
}

