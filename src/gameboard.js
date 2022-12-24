import Cell from "./cell"
import { InvalidOperation } from "./error"
import Position from "./position"
import { SHIP_LENGTHS, ShipBuilder, SHIP } from "./ship"

const STATES = {
    pregame: 0,
    p1turn: 1,
    p2turn: 2
}

const Gameboard = () => {
    let state = STATES.pregame
    let p1board = []
    let p2board = []

    initBoards()

    function resetGame () {
        state = STATES.pregame
        initBoards()
    }

    function initBoards () {
        for (let i = 0; i < 10; i++) {
            p1board[i] = []
            p2board[i] = []
            for (let j = 0; j < 10; j++) {
                p1board[i][j] = Cell()
                p2board[i][j] = Cell()
            }
        }
    }

    const getPlayerBoard = (playerId) => {
        if (playerId === 1) {
            return p1board
        }
        if (playerId === 2) {
            return p2board
        }
        throw new Error('invalid id')
    }

    const getEnemyBoard = (playerId) => {
        if (playerId === 1) {
            return p2board
        }
        if (playerId === 2) {
            return p1board
        }
        throw new Error('invalid id')
    } 

    const isPlaceableAtBoardPosition = (board, position) => {
        let cell
        try {
            cell = board[position.getY()][position.getX()] // if outside of board, cell will be undefined
        } catch (err) {
            // or TypeError will be thrown since first array is undefined
            if (err instanceof TypeError) { cell = undefined }
            else throw err
        }
        return !(cell === undefined) && !cell.hasShip()
    }

    const isValidShipPlacement = (board, shipPositions) => {
        if (shipPositions.length === 0) {
            return false
        }

        const validPlace = shipPositions
            .map((pos) => isPlaceableAtBoardPosition(board, pos))
            .reduce((prev, curr) => prev && curr)

        return validPlace
    } 

    const isPositionOnBoard = (position) => {
        if (position.getX() < 0 || position.getX() > 9 ||
            position.getY() < 0 || position.getY() > 9) {
            return false
        }
        return true
    } 

    const isShipAlive = (board, shipName) => {
        let c = board[1][1]
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = board[i][j] 
                if (cell.getShip() !== null && 
                    cell.getShip().getName() === shipName && 
                    !cell.getShip().isSunk()) {
                return true
                }    
            }
        }
        return false
    } 

    const placeShip = (playerId, shipName, position, vertical=false) => {
        if (state !== STATES.pregame) {
            throw new InvalidOperation('Must be in pregame to place ships')
        }

        const board = getPlayerBoard(playerId) // throws Error if not valid playerId
        const shipObj = ShipBuilder(shipName) // throws TypeError if not valid shipName

        // Confirm ship is not already placed
        if (isShipAlive(board, shipName)) {
            throw new InvalidOperation('Ship already exists on the board')
        }

        // get the positions for the entire ship
        const shipPositions = []
        for (let i = 0; i < SHIP_LENGTHS[shipName]; i++) {
            vertical ? shipPositions.push(position.add(Position(0, i))) 
                     : shipPositions.push(position.add(Position(i, 0)))
        }

        if (!isValidShipPlacement(board, shipPositions)) {
            throw new InvalidOperation('invalid ship placement')
        } 

        // valid ship, put into map
        shipPositions.forEach((pos) => {
            board[pos.getY()][pos.getX()].addShip(shipObj)
        })

        // check if if all the ships are on the map to start game
        let shipsToPlace = new Set(Object.keys(SHIP))
        board.forEach(col => {
            col.forEach(cell => {
                if (cell.getShip() !== null) {
                    shipsToPlace.delete(cell.getShip().getName())
                }
            })
        })
        let enemyShipsToPlace = new Set(Object.keys(SHIP))
        getEnemyBoard(playerId).forEach(col => {
            col.forEach(cell => {
                if (cell.getShip() !== null) {
                    enemyShipsToPlace.delete(cell.getShip().getName())
                }
            })
        })

        if (shipsToPlace.size === 0 && enemyShipsToPlace.size === 0) {
            state = STATES.p1turn
        }

        return getResponse(playerId)
    }

    const attack = (playerId, position) => {
        if (!(playerId === 1 && state === STATES.p1turn) &&
            !(playerId === 2 && state === STATES.p2turn)) {
            throw new InvalidOperation('Cannot attack when it is not your turn')
        }
        
        let board = getEnemyBoard(playerId)
        if (!isPositionOnBoard) {
            throw new InvalidOperation('Invalid Position')
        }
        board[position.getY()][position.getX()].hit()
        
        if (state === STATES.p1turn) {
            state = STATES.p2turn
        } else {
            state = STATES.p1turn
        }

        return getResponse(playerId)
    }

    const getResponse = (playerId) => {
        const board = getPlayerBoard(playerId)
        const response = {
            board: {
                shells: [],
                ships: {}
            },
            enemyBoard: {
                shells:[]
            },
            player: playerId,
            attackTurn: playerId === state 
            // TODO:  want to change later for player ids other than 1 or 2
        }

        // Go through player board and create response
        board.forEach((col, y) => {
            col.forEach((cell, x) => {
                // Shell object
                if (cell.isHit()) {
                    response.board.shells.push({
                        x: x,
                        y: y,
                        hitShip: cell.hasShip()
                    })
                }
                // Ships object
                const ship = cell.getShip()
                if (ship !== null) {
                    let responseShip
                    if (response.board.ships[ship.getName()] === undefined) {
                        response.board.ships[ship.getName()] = {positions:[]}
                    }
                    responseShip = response.board.ships[ship.getName()]
                    responseShip.alive = !ship.isSunk()
                    responseShip.positions.push({
                        x: x,
                        y: y
                    })
                }
            })
        })

        // Repeat for enemy board
        const enemyBoard = getEnemyBoard(playerId) 
        enemyBoard.forEach((col, y) => {
            col.forEach((cell, x) => {
                if (cell.isHit()) {
                    response.enemyBoard.shells.push({
                        x: x,
                        y: y,
                        hitShip: cell.hasShip()
                    })
                }
            })
        })

        return response
    }

    return {placeShip, attack, resetGame, getResponse}

}

export default Gameboard