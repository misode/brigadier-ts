import { CommandDispatcher, literal } from '../src'

describe('CommandDispatcher', () => {
	test('create', () => {
		const dispatcher = new CommandDispatcher()
	})

	test('execute', () => {
		const dispatcher = new CommandDispatcher()
		dispatcher.register(literal('foo')
			.executes(() => 2)
		)
		const result = dispatcher.execute('foo', undefined)
		expect(result).toEqual(2)
	})

	test('execute (zero result)', () => {
		const dispatcher = new CommandDispatcher()
		dispatcher.register(literal('foo')
			.executes(() => 0)
		)
		const result = dispatcher.execute('foo', undefined)
		expect(result).toEqual(0)
	})
})
