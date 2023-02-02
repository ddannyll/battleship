import { BadParams, InvalidOperation } from "./error/apiError.js"
import Gameboard from "./gameboard.js"
import uniqid from 'uniqid'
import Position from "./position.js"

const MatchMaker = () => {
    const games = {}
    const isGameJoinable = (gameId) => {
        if (!(gameId in games) || games[gameId].playerTwo !== undefined) {
            return false
        }
        return true
    }

    const wrapResponse = (response, token, gameId) => {
        return {
            ...response,
            token,
            gameId
        }
    }

    const createGame = () => {
        const playerToken = uniqid()
        const gameId = uniqid()
        games[gameId] = {
            gameboard: Gameboard(),
            playerOne: playerToken,
            playerTwo: undefined
        }
        return wrapResponse(games[gameId].gameboard.getResponse(1), playerToken, gameId)
    }

    const joinGame = (gameId) => {
        if (!isGameJoinable(gameId)) {
            throw new InvalidOperation('Game is not joinable')
        }
        const token = uniqid()
        games[gameId].playerTwo = token
        return wrapResponse(games[gameId].gameboard.getResponse(2), token, gameId)
    }


    const getPlayerNumber = (gameId, token) => {
        if (!gameId in games) {
            throw new BadParams('Invalid gameId:' + gameId)
        }
        if (games[gameId].playerOne === token) {
            return 1
        }
        if (games[gameId].playerTwo === token) {
            return 2
        } 
        throw new BadParams('Supplied token not in specified game')
    }

    const createPositionObject = (x, y) => {
        try {
            return Position(x, y)
        } catch (err) {
            if (err instanceof TypeError) {
                throw new BadParams('Invalid position param')
            }
            throw err
        }
    }

    const attack = (gameId, token, x, y) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard 
        return wrapResponse(gameboard.attack(player, createPositionObject(x, y)), token, gameId)
    }

    const place = (gameId, token, shipName, x, y, vertical=false) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard 
        return wrapResponse(gameboard.place(player, shipName, createPositionObject(x, y), vertical), token, gameId)
    }

    const getResponse = (gameId, token) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard
        return wrapResponse(gameboard.getResponse(player), token, gameId)
    }


    return {attack, place, getResponse, createGame, joinGame}

}

export default MatchMaker