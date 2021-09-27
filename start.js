const concurrently = require('concurrently');

concurrently(
    [
        { command: 'cd server && yarn start', name: '  Server  ', prefixColor: 'red.bold' },
        { command: 'cd client && yarn start', name: '  Client  ', prefixColor: 'yellow.bold' },
    ],
    { killOthers: ['failure'] }
);
