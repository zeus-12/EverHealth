module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo", "nativewind/babel"],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@hooks": "./src/hooks",
						"@screens": "./src/screens",
						"@components": "./src/components",
						"@lib": "./src/lib",
						"@": "./src",
					},
				},
			],
		],
	};
};
