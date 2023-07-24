import express from "express";
import router from "./routes/roles.routes.js";
import rolesRutas from "./Services/roles/routes.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use('/apiCar', router);
app.use('/apiCar', rolesRutas);

// Static FOLDER

app.use('/img/autos', express.static('./img/autos'))
app.use('/img/licencia', express.static('./img/licencia'))
app.use('/img/clientes', express.static('./img/clientes'))

export default app;
