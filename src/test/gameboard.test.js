import { describe, expect, jest, test } from '@jest/globals';
import { InvalidOperation } from '../error';
import { SHIP } from '../ship';
import Gameboard from '../gameboard';
import Position from '../position';
import _ from 'lodash';

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
        gameboard.placeShip(p1id, 'destroyer', Position(1, 2))
        gameboard.placeShip(p1id, 'submarine', Position(1, 3))
        gameboard.placeShip(p1id, 'battleship', Position(1, 4))
        gameboard.placeShip(p1id, 'carrier', Position(1, 5))
        // player 1 has placed all their ships
        gameboard.placeShip(p2id, 'patrolBoat', Position(1, 1))
        // player 1 shouldn't be able to attack player 2 since they are not ready
        expect(() => {gameboard.attack(p1id, Position(1, 1))}).toThrow(InvalidOperation)
    })

    test('duplicate ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, 'patrolBoat', Position(1, 1))
        expect(() => {gameboard.placeShip(p1id, 'patrolBoat', Position(1, 2))}).toThrow(InvalidOperation)
    })

    
    test('overlapping ship placement', () => {
        const gameboard = Gameboard()
        gameboard.placeShip(p1id, 'patrolBoat', Position(1, 1), true)
        expect(() => {gameboard.placeShip(p1id, 'destroyer', Position(0, 2))}).toThrow(InvalidOperation)
    })

    test('out of bounds placement', () => {
        const gameboard = Gameboard()
        expect(() => {gameboard.placeShip(p1id, 'patrolBoat', Position(-1, 1))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, 'battleship', Position(9, 9))}).toThrow(InvalidOperation)
        expect(() => {gameboard.placeShip(p1id, 'submarine', Position(8, 8), true)}).toThrow(InvalidOperation)
    })
})

describe('game', () => {
    let gameboard

    const getShell = (array, position) => {
        for (let element of array) {
            if (element.x == position.getX() && element.y == position.getY()) {
                return element
            }
        }
        return null
    }

    beforeEach( () => {
        gameboard = Gameboard()
        gameboard.placeShip(p1id, SHIP.patrolBoat, Position(0,0))
        gameboard.placeShip(p1id, SHIP.destroyer, Position(0,1))
        gameboard.placeShip(p1id, SHIP.submarine, Position(0,2))
        gameboard.placeShip(p1id, SHIP.battleship, Position(0,3))
        gameboard.placeShip(p1id, SHIP.carrier, Position(0,4))
        gameboard.placeShip(p2id, SHIP.patrolBoat, Position(0,0))
        gameboard.placeShip(p2id, SHIP.destroyer, Position(0,1))
        gameboard.placeShip(p2id, SHIP.submarine, Position(0,2))
        gameboard.placeShip(p2id, SHIP.battleship, Position(0,3))
        gameboard.placeShip(p2id, SHIP.carrier, Position(0,4))
    })

    test('Correct ID and Turn', () => {
        let p1response = gameboard.getResponse(p1id)
        let p2response = gameboard.getResponse(p2id)
        expect(p1response.player).toBe(p1id)
        expect(p2response.player).toBe(p2id)
        expect(p1response.attackTurn).toBe(true)
        expect(p2response.attackTurn).toBe(false)
        p1response = gameboard.attack(p1id, Position(0,0))
        expect(p1response.attackTurn).toBe(false)
        p2response = gameboard.getResponse(p2id)
        expect(p2response.attackTurn).toBe(true)
        p2response = gameboard.attack(p2id, Position(0,0))
        expect(p1response.attackTurn).toBe(false)
    })


    test('Hit Registration', () => {
        let p1response = gameboard.attack(p1id, Position(0, 0))
        expect(getShell(p1response.enemyBoard.shells, Position(0, 0)).hitShip).toBe(true)
        let p2response = gameboard.attack(p2id, Position(9,9))
        expect(getShell(p2response.board.shells, Position(0, 0)).hitShip).toBe(true)
        expect(getShell(p2response.enemyBoard.shells, Position(9, 9)).hitShip).toBe(false)
    })

    test('Stop placement of more ships', () => {
        // Sink p2 patrol boat
        gameboard.attack(p1id, Position(0, 0))
        gameboard.attack(p2id, Position(0, 0))
        gameboard.attack(p1id, Position(1, 0))
        expect(() => {gameboard.placeShip(p2id, SHIP.patrolBoat, Position(8,8))}).toThrow(InvalidOperation)
    })

    test('Ship Sinking', () => {
        gameboard.attack(p1id, Position(0, 0))
        let p2response = gameboard.attack(p2id, Position(0, 0))
        expect(p2response.board.ships.patrolBoat.alive).toBe(true)
        gameboard.attack(p1id, Position(1, 0))
        p2response = gameboard.getResponse(p2id)
        expect(p2response.board.ships.patrolBoat.alive).toBe(false)
    })
})
