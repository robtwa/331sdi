import express, { Express } from "express";
import bodyParser from 'body-parser';
import { newQuestion, checkAnswer } from './routes';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/new", newQuestion);
app.get("/api/check", checkAnswer);
app.listen(port, () => console.log(`Server listening on ${port}`));
