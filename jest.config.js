module.exports = {
	testURL: "http://localhost",
	//rootDir: "../",
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
		"\\.(css|less|scss)$": "identity-obj-proxy",
		"^components(.*)$": "<rootDir>/client/source/components$1",
		"^decorators(.*)$": "<rootDir>/client/source/decorators$1",
		"^reducers(.*)$": "<rootDir>/client/source/redux/reducers$1",
		"^assets(.*)$": "<rootDir>/client/source/assets$1",
	},
	verbose: true,
	transform: {
		"^.+\\.jsx$": "babel-jest",
		"^.+\\.js$": "babel-jest"
	},
	moduleDirectories: [
		"node_modules"
	],
	//preset: "babel-jest",
	setupFiles: ["enzyme-react-16-adapter-setup"],
	setupTestFrameworkScriptFile: "./jest/jest.setup.js"
}