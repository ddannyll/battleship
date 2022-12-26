import Cell from "./cell.js"
import { InvalidOperation, BadRequest, ApiError } from "./error/apiError"

const Ship = (length, name='defaultShip') => {
    if (!Number.isInteger(length) || length < 1) {
        throw new TypeError('Ship length must be a positive integer')
    }

    if (!name instanceof String) {
        throw new TypeError('Ship name must be a string')
    }

    let hitPoints = length
    
    const hit = () => {
        if (isSunk()) {
            throw new InvalidOperation("Cannot hit a ship that is already sunk")
        }
        hitPoints--
    }

    const isSunk = () => {
        return hitPoints < 1
    }

    const getLength = () => {
        return length
    }

    const getName = () => {
        return name
    }

    return {hit, isSunk, getLength, getName}
}

const ShipBuilder = (name) => {
    const nameMap = {
        carrier: () => {return Ship(SHIP_LENGTHS['carrier'], 'carrier')},
        battleship: () => {return Ship(SHIP_LENGTHS['battleship'], 'battleship')},
        destroyer: () => {return Ship(SHIP_LENGTHS['destroyer'], 'destroyer')},
        submarine: () => {return Ship(SHIP_LENGTHS['submarine'], 'submarine')},
        patrolBoat: () => {return Ship(SHIP_LENGTHS['patrolBoat'], 'patrolBoat')}
    }
    if (!(name in nameMap)) {
        throw TypeError('Invalid ship name')
    }
    return nameMap[name]()
}

const SHIP_LENGTHS = {
    carrier: 5, 
    battleship: 4,
    destroyer: 3,
    submarine: 3,
    patrolBoat: 2
}

const SHIP = {
    carrier: 'carrier',
    battleship: 'battleship',
    destroyer: 'destroyer',
    submarine: 'submarine',
    patrolBoat: 'patrolBoat'
}


export {ShipBuilder, SHIP_LENGTHS, SHIP}