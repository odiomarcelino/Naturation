package main

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan []byte)

func socketHandler(w http.ResponseWriter, r *http.Request) {
    // Upgrade HTTP → WS
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }
    // Register client
    clients[conn] = true
    defer func() {
        delete(clients, conn)
        conn.Close()
    }()

    for {
        _, msg, err := conn.ReadMessage()
        if err != nil {
            log.Println("Read error:", err)
            break
        }
        // Push to broadcast channel
        broadcast <- msg
    }
}

func handleMessages() {
    for {
        msg := <-broadcast
        for client := range clients {
            if err := client.WriteMessage(websocket.TextMessage, msg); err != nil {
                log.Println("Broadcast error:", err)
                client.Close()
                delete(clients, client)
            }
        }
    }
}

func main() {
    go handleMessages()

    http.HandleFunc("/", socketHandler)
    log.Println("Go WebSocket server running ... (path /api/socket in Vercel)")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
