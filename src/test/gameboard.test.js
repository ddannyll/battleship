import { describe, expect, jest, test } from '@jest/globals';
import { InvalidOperation } from '../error';
import Gameboard from '../gameboard';
import Position from '../position';

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
        gameboard.placeShip(p1id, 'patrolBoat', Position(1, 1))
        gameboard.placeShip(p1id, 'destroyer', Position(2, 1))
        gameboard.placeShip(p1id, 'submarine', Position(3, 1))
        gameboard.placeShip(p1id, 'battleship', Position(4, 1))
        gameboard.placeShip(p1id, 'carrier', Position(5, 1))
        // player 1 has placed all their ships
        gameboard.placeShip(p2id, 'patrolBoat', Position(1, 1))
        // player 1 shouldn't be able to attack player 2 since they are not ready
        expect(() => {gameboard.attack(p1id, Position(1, 1))}).toThrow(InvalidOperation)
    })

    test('duplicate ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, 'patrolBoat', Position(1, 1))
        expect(() => {gameboard.placeShip(p1id, 'patrolBoat', Position(2, 1))}).toThrow(InvalidOperation)
    })

    
    test('overlapping ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, 'patrolBoat', Position(1, 1), true)
        expect(() => {gameboard.placeShip(p1id, 'destroyer', Position(2, 1))}).toThrow(InvalidOperation)
    })

    test('out of bounds placement', () => {
        const gameboard = Gameboard()
        expect(() => {gameboard.placeShip(p1id, 'patrolBoat', Position(-1, 1))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, 'battleship', Position(9, 9))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, 'submarine', Position(8, 8), true)}).toThrow(InvalidOperation)
    })
})