import express from 'express';
import Gameboard from './gameboard.js';
import Position from './position.js';
import cors from 'cors'
import { InvalidOperation } from './error.js';


const app = express()
const PORT = process.env.PORT

let gameboard = Gameboard()

app.use(cors({
    origin: '*'
}))
app.use(express.json({
    type:['application/json']
}))

const buildPositionObject = (position) => {
    return Position(position.x, position.y)
}

app.post('/place', (req, res) => {
    console.log(req.body);
    const playerId = req.body.playerId
    const shipName = req.body.shipName
    const position = buildPositionObject(req.body.position)
    const vertical = req.body.vertical || false
    try {
        res.send(gameboard.placeShip(playerId, shipName, position, vertical))
    } catch (InvalidOperation) {
        res.status(400).send(InvalidOperation)
    }
})
app.post('/attack', (req, res) => {
    const playerId = req.body.playerId
    const position = buildPositionObject(req.body.position)
    res.send(gameboard.attack(playerId, position))
})

app.get('/response/:playerId', (req, res) => {
    const playerId = parseInt(req.params.playerId)
    res.send(gameboard.getResponse(playerId))
})

app.delete('/reset', (req, res) => {
    res.send(gameboard.resetGame())
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})