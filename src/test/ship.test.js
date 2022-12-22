import { describe, expect, jest, test } from '@jest/globals';
import { InvalidOperation } from '../error';
import { Ship, ShipBuilder } from '../ship'

describe('Generic Ship Tests', () => {
    test('Throws error on invalid ship length', () => {
        expect(() => {Ship(0)}).toThrow(TypeError)
        expect(() => {Ship('4')}).toThrow(TypeError)
    })
    
    test('Not sunk on creation', () => {
        const ship = Ship(2)
        expect(ship.isSunk()).toBe(false)
    })
    
    test('Not sunk on incorrect number of hits', () => {
        const ship = Ship(3)
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(false)
    })
    
    test('Basic Sinking', () => {
        const ship = Ship(2)
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(true)
    })
    
    test('Throws error on too many hits', () => {
        const ship = Ship(4)
        ship.hit()
        ship.hit()
        ship.hit()
        ship.hit()
        expect(() => {ship.hit()}).toThrow(InvalidOperation)
    })
})

describe('Custom Ship Tests', () => {
    test('Ship Length', () => {
        expect(ShipBuilder('carrier').getLength()).toBe(5)
        expect(ShipBuilder('battleship').getLength()).toBe(4)
        expect(ShipBuilder('destroyer').getLength()).toBe(3)
        expect(ShipBuilder('submarine').getLength()).toBe(3)
        expect(ShipBuilder('patrolBoat').getLength()).toBe(2)
    })
})