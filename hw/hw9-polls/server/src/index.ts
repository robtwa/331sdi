import express, { Express } from "express";
import {list, save, load, vote, results} from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", list);
app.post("/api/save", save);
app.get("/api/load", load);
app.post("/api/vote", vote);
app.get("/api/result", results);         // Get the data of a vote's result

app.listen(port, () => console.log(`Server listening on ${port}`));
