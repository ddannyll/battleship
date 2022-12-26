import express from 'express';
import Gameboard from './gameboard.js';
import Position from './position.js';
import cors from 'cors'
import { InvalidOperation, ApiError, BadParams } from './error/apiError.js';


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

app.use((req, res, next) => {
    console.log(req.path);
    next()
})

app.post('/place', (req, res, next) => {
    const playerId = req.body.playerId
    const shipName = req.body.shipName
    const position = buildPositionObject(req.body.position)
    const vertical = req.body.vertical || false
    try {
        res.send(gameboard.placeShip(playerId, shipName, position, vertical))
    } catch (error) {
        next(error)
    }
})
app.post('/attack', (req, res, next) => {
    const playerId = req.body.playerId
    const position = buildPositionObject(req.body.position)
    try {
        res.send(gameboard.attack(playerId, position))
    } catch (error) {
        next(error)
    }
})

app.get('/response/:playerId', (req, res) => {
    const playerId = parseInt(req.params.playerId)
    res.send(gameboard.getResponse(playerId))
})

app.delete('/reset', (req, res) => {
    const playerId = req.body.playerId
    try {
        res.send(gameboard.resetGame(playerId))
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error.message)
    }
})

app.use((err, req, res, next) => {
    console.error(err)
    if (err instanceof InvalidOperation) {
        console.log('sending 400');
        res.status(400).json(err.message)
    } else {
        console.log('sending 500');
        res.status(500).json('something broke')
    }
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})