const app = require("express")();
const http = require("http").createServer(app);
const port = process.env.PORT || 8080

const io = require("socket.io")(http);

var players = {};

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`);
    players[socket.id] = { id: socket.id, avatarColour: 0x6b6b6b, avatarShape: "Rhombus", avatarPosition: {}, avatarRotation: {} };

    socket.on("disconnect", (reason) => {
        console.log(`User ${socket.id} disconnected`);
        delete players[socket.id];
    });

    // Main script //
    socket.on("sendClientData", (playerAvatarObjectPosition, playerCameraObjectRotation, playerAvatarColour, playerAvatarShape) => {
        players[socket.id].avatarPosition = playerAvatarObjectPosition;
        players[socket.id].avatarRotation = playerCameraObjectRotation;
        players[socket.id].avatarColour = playerAvatarColour;
        players[socket.id].avatarShape = playerAvatarShape;
    });

    socket.on("sendPositionData", (data) => {
        players[socket.id].objectLoc = data;
    });

    socket.on("sendRotationData", (data2) => {
        players[socket.id].objectRot = data2;
    });

    socket.on("sendColourData", (data3) => {
        players[socket.id].objectColour = data3;
    });
});

setInterval(() => {
    io.emit("playerdata", players);
}, 10);

http.listen(port, () => {
    console.log(`listening on port ${port}`);
});
