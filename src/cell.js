import { InvalidOperation } from "./error/apiError.js"

const Cell = (ship=null) => {
    let hasBeenHit = false
    const isHit = () => { return hasBeenHit }
    const hasShip = () => { 
        if (ship) { return true } else { return false }
    }
    const hit = () => {
        if (isHit()) {
            throw new InvalidOperation('Cannot hit an already hit cell')
        }
        hasBeenHit = true
        if (ship !== null && 'hit' in ship && typeof ship.hit === 'function') {
            ship.hit()
            return true
        }
        return false
    }
    const addShip = (shipObject) => {
        if (ship !== null) {
            throw new InvalidOperation('Ship already exists on this cell')
        }
        ship = shipObject
    }
    const getShip = () => {
        return ship
    }
    return {hit, isHit, hasShip, addShip, getShip}
}

export default Cell