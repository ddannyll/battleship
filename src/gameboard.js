import Cell from "./cell"
import { InvalidOperation } from "./error"
import Position from "./position"
import { SHIP_LENGTHS, ShipBuilder } from "./ship"

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

    function initBoards () {
        for (let i = 0; i < 10; i++) {
            p1board.push([])
            p2board.push([])
            for (let j = 0; j < 10; j++) {
                p1board[i].push(Cell())
                p2board[i].push(Cell())
            }
        }
    }

    const getPlayerBoard = (playerId) => {
        if (playerId == 1) {
            return p1board
        }
        if (playerId == 2) {
            return p2board
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

    const confirmValidShipPositions = (board, shipPositions) => {
        if (shipPositions.length === 0) {
            throw new InvalidOperation('Invalid placement of ship')
        }

        const validPlace = shipPositions
            .map((pos) => isPlaceableAtBoardPosition(board, pos))
            .reduce((prev, curr) => prev && curr)

        if (!validPlace) {
            throw new InvalidOperation('Invalid placement of ship')
        }
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

        confirmValidShipPositions(board, shipPositions) // throws Error if not valid

        // valid ship, put into map
        shipPositions.forEach((pos) => {
            board[pos.getY()][pos.getX()].addShip(shipObj)
        })

    }

    const attack = () => {
        throw new InvalidOperation('test')
    }

    return {placeShip, attack}

}

export default Gameboard