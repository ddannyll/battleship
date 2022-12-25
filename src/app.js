import express from 'express';
import Gameboard from './gameboard.js';
import Position from './position.js';
import cors from 'cors'
import { InvalidOperation } from './error.js';


const app = express()
const PORT = process.env.PORT || 4200

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
    const playerId = req.body.playerId
    const shipName = req.body.shipName
    const position = buildPositionObject(req.body.position)
    const vertical = req.body.vertical || false
    try {
        res.send(gameboard.placeShip(playerId, shipName, position, vertical))
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error.message)
    }
})
app.post('/attack', (req, res) => {
    console.log(req.body);
    const playerId = req.body.playerId
    const position = buildPositionObject(req.body.position)
    try {
        res.send(gameboard.attack(playerId, position))
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error.message)
    }
})

app.get('/response/:playerId', (req, res) => {
    const playerId = parseInt(req.params.playerId)
    res.send(gameboard.getResponse(playerId))
})

app.delete('/reset', (req, res) => {
    const playerId = req.body.playerId
    console.log(req.body);
    try {
        res.send(gameboard.resetGame(playerId))
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error.message)
    }
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})