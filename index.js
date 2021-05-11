const app        = require('express')();
const bodyParser = require('body-parser');

const trelloHandler = require('./modules/trello/handler');
const logger        = require('./modules/utils/logger');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/trello', trelloHandler.get);
app.post('/trello', trelloHandler.post);

app.listen(PORT, () => logger.info('Server is ready!'));
