import express, { Express } from "express";
import { save, list, load, deleteSq } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", save);
app.get("/api/list", list);
app.get("/api/load", load);
app.get("/api/delete", deleteSq);


app.listen(port, () => console.log(`Server listening on ${port}`));
