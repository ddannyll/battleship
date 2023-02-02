import { uniqueId } from "lodash"
import { InvalidOperation } from "./error/apiError"
import Gameboard from "./gameboard"

const MatchMaker = () => {
    const games = {}
    const isGameJoinable = (gameId) => {
        if (!gameId in games || games[gameId].playerTwo !== undefined) {
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
        const playerToken = uniqueId()
        const gameId = uniqueId()
        games[gameId] = {
            gameboard: Gameboard(),
            playerOne: playerToken,
            playerTwo: undefined
        }
        wrapResponse(games[gameId].getResponse(1), playerToken, gameId)
    }

    const joinGame = (gameId) => {
        if (!isGameJoinable) {
            throw new InvalidOperation('Game is not joinable')
        }
        const token = uniqueId()
        games[gameId].playerTwo = token
        return wrapResponse(games[gameId].gameboard.getResponse(2), token, gameId)
    }


    const getPlayerNumber = (gameId, token) => {
        if (!gameId in games) {
            throw new InvalidOperation('Invalid gameId:' + gameId)
        }
        if (games[gameId].playerOne === token) {
            return 1
        }
        if (games[gameId].playerTwo === token) {
            return 2
        } 
        throw new InvalidOperation('Supplied token not in specified game')
    }

    const attack = (gameId, token, position) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard 
        wrapResponse(gameboard.attack(player, position), token, gameId)
    }

    const place = (gameId, token, shipName, position, vertical=false) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard 
        wrapResponse(gameboard.place(player, shipName, position, vertical), token, gameId)
    }

    const getResponse = (gameId, token) => {
        const player = getPlayerNumber(gameId, token)
        const gameboard = games[gameId].gameboard
        wrapResponse(gameboard.getResponse(player), token, gameId)
    }


    return {attack, place, getResponse, createGame, joinGame}

}

export default MatchMaker