import express, { Router } from 'express';
import bodyParser from 'body-parser';

import initRoutes from './routes';
import errorHandler from './middlewares/errorHandler';

class App {
    constructor() {
        const app = express();

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.set('trust proxy', true)

        const router = new Router();
        initRoutes(router);

        app.use(router);

        app.use(errorHandler)

        return app;
    }
}

export default App;