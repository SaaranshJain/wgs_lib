const concurrently = require('concurrently');

concurrently(
    [
        { command: 'cd server && yarn dev', name: '  Server  ', prefixColor: 'red.bold' },
        { command: 'cd client && yarn dev', name: '  Client  ', prefixColor: 'yellow.bold' },
    ],
    { killOthers: ['failure'] }
);
