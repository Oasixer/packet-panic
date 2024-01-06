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
func DataServer(infoUpdateQ chan InfoUpdate) error {
  var handleConnections = func(w http.ResponseWriter, r *http.Request) {
    for {
      // Upgrade initial GET request to a websocket
      ws, err := upgrader.Upgrade(w, r, nil)
      if err != nil {
        log.Printf("error upgrading to websocket: %v", err)
        return // Return instead of fatal to keep the server running
      }

      // Create a channel to signal when the connection is closed
      closed := make(chan struct{})

      // Setup a goroutine to handle the case where the client disconnects
      go func() {
        for {
          if _, _, err := ws.NextReader(); err != nil {
            ws.Close()
            close(closed)
            return
          }
        }
      }()

      for {
        select {
        case infoUpdate := <-infoUpdateQ:
          // Send a JSON object
          err = ws.WriteJSON(infoUpdate)
          if err != nil {
            log.Printf("error writing to websocket: %v", err)
            return // Return to attempt a reconnection on the next loop iteration
          }
          time.Sleep(10 * time.Millisecond) // Adjust sleep interval as needed

        case <-closed:
          return // Exit the loop if the connection is closed
        }
      }
    }
  }

  http.HandleFunc("/ws", handleConnections)
  log.Println("Starting server on :8080")
  err := http.ListenAndServe(":8080", nil)
  if err != nil {
    log.Fatalf("ListenAndServe: %v", err)
  }
  return nil
}
// func DataServer(infoUpdateQ chan InfoUpdate) error{
//   var handleConnections = func(w http.ResponseWriter, r *http.Request) {
//     // Upgrade initial GET request to a websocket
//     ws, err := upgrader.Upgrade(w, r, nil)
//     if err != nil {
//         log.Fatal(err)
//     }
//     defer ws.Close()
//
//     for {
//       infoUpdate := <- infoUpdateQ
//       // Send a JSON object every second
//       // jsonMessage, err := json.Marshal(infoUpdate)
//       if err != nil {
//         log.Printf("error calling json.Marshal to json-string-encode infoUpdate: %v\n", err)
//         return
//       }
//       err = ws.WriteJSON(infoUpdate)
//       if err != nil {
//         log.Printf("error: %v", err)
//         break
//       }
//       time.Sleep(10 * time.Millisecond) // TODO: determine proper sleep interval
//     }
//   }
//   http.HandleFunc("/ws", handleConnections)
//   // ListenAndServe listens on the TCP network address addr and then calls
//   // Serve with handler to handle requests on incoming connections.
//   // Accepted connections are configured to enable TCP keep-alives.
//   //
//   // The handler is typically nil, in which case the DefaultServeMux is used.
//   http.ListenAndServe(":8080", nil)
//   return nil
// }
//
