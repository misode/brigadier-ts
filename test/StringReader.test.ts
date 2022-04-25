import { StringReader } from '../src/StringReader'

describe('StringReader', () => {
	test('readInt', () => {
		const reader = new StringReader('5')
		const value = reader.readInt()
		expect(value).toEqual(5)
	})

	test('readInt (trailing)', () => {
		const reader = new StringReader('5a')
		const value = reader.readInt()
		expect(value).toEqual(5)
		expect(reader.getCursor()).toEqual(1)
	})

	test('readInt (NaN)', () => {
		const reader = new StringReader('5-')
		expect(() => reader.readInt()).toThrow('Invalid integer')
	})

	test('readInt (invalid)', () => {
		const reader = new StringReader('a')
		expect(() => reader.readInt()).toThrow('Expected integer')
	})

	test('readInt (float)', () => {
		const reader = new StringReader('1.3')
		expect(() => reader.readInt()).toThrow('Invalid integer')
	})

	test('readFloat', () => {
		const reader = new StringReader('1.3')
		const value = reader.readFloat()
		expect(value).toEqual(1.3)
	})

	test('readFloat (NaN)', () => {
		const reader = new StringReader('1.3-')
		expect(() => reader.readFloat()).toThrow('Invalid float')
	})

	test('readFloat (invalid)', () => {
		const reader = new StringReader('sw')
		expect(() => reader.readFloat()).toThrow('Expected float')
	})
})
