import express from 'express';
import { InvalidOperation, ApiError, BadParams } from './error/apiError.js';
import Gameboard from './gameboard.js';
import cors from 'cors'
import MatchMaker from './matchMaker.js';


const app = express()
const PORT = process.env.PORT || 4200

let gameboard = Gameboard()
let matchMaker = MatchMaker()

app.use(cors({
    origin: '*'
}))
app.use(express.json({
    type:['application/json']
}))


app.use((req, res, next) => {
    console.log(req.path + ' ' + req.body.token);
    next()
})

app.post('/create', (req, res, next) => {
    try {
        res.send(matchMaker.createGame(req.body.token))
    } catch(error) {
        next(error)
    }
})

app.post('/join/:gameId', (req, res, next) => {
    try {
        res.send(matchMaker.joinGame(req.params.gameId, req.body.token))
    } catch(error) {
        next(error)
    }
})

app.post('/place/:gameId', (req, res, next) => {
    const gameId = req.params.gameId
    const token = req.body.token
    const shipName = req.body.shipName
    const position = req.body.position
    const vertical = req.body.vertical || false
    try {
        res.send(matchMaker.place(gameId, token, shipName, position?.x, position?.y, vertical))
    } catch (error) {
        next(error)
    }
})
app.post('/attack/:gameId', (req, res, next) => {
    const gameId = req.params.gameId
    const token = req.body.token
    const position = req.body.position
    try {
        res.send(matchMaker.attack(gameId, token, position.x, position.y))
    } catch (error) {
        next(error)
    }
})

app.get('/response/:gameId', (req, res, next) => {
    const gameId = req.params.gameId
    const token = req.query.token

    try {
        res.send(matchMaker.getResponse(gameId, token))
    } catch (error) {
        next(error)
    }
})

app.post('/token', (req, res, next) => {
    try {
        res.send(matchMaker.createToken())
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
    if (err instanceof ApiError) {
        console.log('sending 400: ' + err.message);
        res.status(400).send(err.message)
    } else {
        console.error(err)
        console.log('sending 500');
        res.status(500).send('something broke')
    }
})

app.listen(PORT, () => {
    console.log("Battleship running on port " + PORT);
})