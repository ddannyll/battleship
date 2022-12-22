import { InvalidOperation } from "./error"

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

    return {hit, isSunk}
}

export default Ship