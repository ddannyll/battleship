import { InvalidOperation } from "./error"

const Ship = (length) => {
    if (!Number.isInteger(length) || length < 1) {
        throw new InvalidOperation('Ship length must be a positive integer')
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