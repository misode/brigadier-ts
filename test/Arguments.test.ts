import { argument, CommandDispatcher, FloatArgumentType, IntegerArgumentType, literal, LongArgumentType } from '../src'

describe('Arguments', () => {
	test('Integer', () => {
		const dispatcher = new CommandDispatcher()
		dispatcher.register(literal('foo')
			.then(argument('bar', new IntegerArgumentType())
				.executes(ctx => ctx.get('bar') * 2)
			)
		)
		const result = dispatcher.execute('foo 6', undefined)
		expect(result).toEqual(12)
	})

	test('Long', () => {
		const dispatcher = new CommandDispatcher()
		dispatcher.register(literal('foo')
			.then(argument('bar', new LongArgumentType())
				.executes(ctx => ctx.get('bar').toString().length)
			)
		)
		const result = dispatcher.execute('foo 123456789012345', undefined)
		expect(result).toEqual(15)
	})

	test('Float', () => {
		const dispatcher = new CommandDispatcher()
		dispatcher.register(literal('foo')
			.then(argument('bar', new FloatArgumentType())
				.executes(ctx => Math.floor(ctx.get('bar')))
			)
		)
		const result = dispatcher.execute('foo 6.2', undefined)
		expect(result).toEqual(6)
	})
})
