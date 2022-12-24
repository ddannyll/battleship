import express from 'express';
import Gameboard from './gameboard.js';
import Position from './position.js';


const app = express()
const PORT = 7777

let gameboard = Gameboard()


app.use(express.json()) // converts body to json

const buildPositionObject = (position) => {
    return Position(position.x, position.y)
}

app.post('/place', (req, res) => {
    const playerId = req.body.playerId
    const shipName = req.body.shipName
    const position = buildPositionObject(req.body.position)
    const vertical = req.body.vertical || false
    res.send(gameboard.placeShip(playerId, shipName, position, vertical))
})

app.post('/attack', (req, res) => {
    const playerId = req.body.playerId
    const position = buildPositionObject(req.body.position)
    res.send(gameboard.attack(playerId, position))
})

app.get('/response', (req, res) => {
    const playerId = req.body.playerId
    res.send(gameboard.getResponse(playerId))
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})