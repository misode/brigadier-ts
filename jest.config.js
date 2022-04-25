/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.tsx?$': [
			'esbuild-jest',
			{
				format: 'esm',
			},
		],
	},
}
