import express, { Express } from "express";
import bodyParser from 'body-parser';
import { listItems, addItem, completeItem } from './routes';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", listItems);
app.post("/api/add", addItem);
app.post("/api/complete", completeItem);
app.listen(port, () => console.log(`Server listening on ${port}`));
