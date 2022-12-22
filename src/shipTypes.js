import Ship from "./ship";

const ShipBuilder = (name) => {
    const nameMap = {
        carrier: () => {return Ship(5, 'carrier')},
        battleship: () => {return Ship(4, 'battleship')},
        destroyer: () => {return Ship(3, 'destroyer')},
        submarine: () => {return Ship(3, 'submarine')},
        patrolBoat: () => {return Ship(2, 'patrolBoat')}
    }
    if (!name in nameMap) {
        throw TypeError('Invalid ship name')
    }
    return nameMap[name]
}

export {ShipBuilder}