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


app.use((req, res, next) => {
    console.log(req.path);
    next()
})

app.post('/place', (req, res, next) => {
    const playerId = req.body.playerId
    const shipName = req.body.shipName
    const position = req.body.position
    const vertical = req.body.vertical || false
    try {
        res.send(gameboard.placeShip(playerId, shipName, Position(position.x, position.y), vertical))
    } catch (error) {
        next(error)
    }
})
app.post('/attack', (req, res, next) => {
    const playerId = req.body.playerId
    const position = req.body.position
    try {
        res.send(gameboard.attack(playerId, Position(position.x, position.y)))
    } catch (error) {
        next(error)
    }
})

app.get('/response/:playerId', (req, res, next) => {
    const playerId = parseInt(req.params.playerId)
    try {
        res.send(gameboard.getResponse(playerId))
    } catch (error) {
        next(error)
    }
})

app.delete('/reset', (req, res, next) => {
    const playerId = req.body.playerId
    try {
        res.send(gameboard.resetGame(playerId))
    } catch (error) {
        next(error)
    }
})

app.use((err, req, res, next) => {
    console.error(err)
    if (err instanceof ApiError) {
        console.log('sending 400: ' + err.message);
        res.status(400).send(err.message)
    } else {
        console.log('sending 500');
        res.status(500).send('something broke')
    }
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})