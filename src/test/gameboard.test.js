import { describe, expect, jest, test } from '@jest/globals';
import { InvalidOperation } from '../error';
import Gameboard from '../gameboard';
import Position from '../position';
import { Battleship, Carrier, Destroyer, PatrolBoat, Submarine } from '../shipTypes';

const p1id = 1
const p2id = 2

describe('pregame', () => {
    test('attack before both placing', () => {
        const gameboard = Gameboard()
        expect(() => {gameboard.attack(p1id, Position(1, 1))}).toThrow(InvalidOperation)
        expect(() => {gameboard.attack(p2id, Position(5, 5))}).toThrow(InvalidOperation)
    })

    test('attack before other player not ready', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, PatrolBoat(), Position(1, 1))
        gameboard.placeShip(p1id, Destroyer(), Position(2, 1))
        gameboard.placeShip(p1id, Submarine(), Position(3, 1))
        gameboard.placeShip(p1id, Battleship(), Position(4, 1))
        gameboard.placeShip(p1id, Carrier(), Position(5, 1))
        // player 1 has placed all their ships
        gameboard.placeShip(p2id, PatrolBoat(), Position(1, 1))
        // player 1 shouldn't be able to attack player 2 since they are not ready
        expect(() => {gameboard.attack(p1id, Position(1, 1))}).toThrow(InvalidOperation)
    })

    test('duplicate ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, PatrolBoat(), Position(1, 1))
        expect(() => {gameboard.placeShip(p1id, PatrolBoat(), Position(2, 1))}).toThrow(InvalidOperation)
    })

    
    test('overlapping ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, PatrolBoat(), Position(1, 1), true)
        expect(() => {gameboard.placeShip(p1id, Destroyer(), Position(2, 1))}).toThrow(InvalidOperation)
    })

    test('out of bounds placement', () => {
        const gameboard = Gameboard()
        expect(() => {gameboard.placeShip(p1id, PatrolBoat(-1, 1))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, Battleship(4, 9))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, Submarine(9, 8), true)}).toThrow(InvalidOperation)
    })
})