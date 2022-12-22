import {expect, jest, test} from '@jest/globals';
import { InvalidOperation } from '../error';
import Ship from '../ship'

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