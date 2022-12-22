import { InvalidOperation } from "./error"

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
        if ('hit' in ship && typeof ship.hit === 'function') {
            ship.hit()
        }
        hasBeenHit = true
    }
    const addShip = (shipObject) => {
        ship = shipObject
    }
    return {hit, isHit, hasShip, addShip}
}

export default Cell