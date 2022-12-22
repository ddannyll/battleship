import Ship from "./ship";

const Carrier = () => {
    return Ship(5, 'Carrier')
}

const Battleship = () => {
    return Ship(4, 'Battleship')
}

const Destroyer = () => {
    return Ship(3, 'Destroyer')
}

const Submarine = () => {
    return Ship(3, 'Submarine')
}

const PatrolBoat = () => {
    return Ship(2, 'PatrolBoat')
}

export {Carrier, Battleship, Destroyer, Submarine, PatrolBoat}