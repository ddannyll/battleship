import { describe, expect, jest, test } from '@jest/globals';
import { ApiError, InvalidOperation, BadParams } from '../error/apiError.js';
import { ShipBuilder } from '../ship.js'

describe('Generic Ship Tests', () => {
    test('Not sunk on creation', () => {
        const ship = ShipBuilder('patrolBoat')
        expect(ship.isSunk()).toBe(false)
    })
    
    test('Not sunk on incorrect number of hits', () => {
        const ship = ShipBuilder('submarine')
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(false)
    })
    
    test('Basic Sinking', () => {
        const ship = ShipBuilder('patrolBoat')
        ship.hit()
        ship.hit()
        expect(ship.isSunk()).toBe(true)
    })
    
    test('Throws error on too many hits', () => {
        const ship = ShipBuilder('battleship')
        ship.hit()
        ship.hit()
        ship.hit()
        ship.hit()
        expect(() => {ship.hit()}).toThrow(InvalidOperation)
    })

    test('Ship Length', () => {
        expect(ShipBuilder('carrier').getLength()).toBe(5)
        expect(ShipBuilder('battleship').getLength()).toBe(4)
        expect(ShipBuilder('destroyer').getLength()).toBe(3)
        expect(ShipBuilder('submarine').getLength()).toBe(3)
        expect(ShipBuilder('patrolBoat').getLength()).toBe(2)
    })
})
