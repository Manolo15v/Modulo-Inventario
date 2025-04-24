import express,  {static as stc, json} from "express";
import morgan from "morgan";
import cors from "cors"; // Importa el paquete cors


import almacenRoutes from "./Inventario/routes/almacen.routes.js"
import equiposRoutes from "./Inventario/routes/equipos.routes.js"
import modeloEquiposRoutes from "./Inventario/routes/modelosEquipos.routes.js";
import modeloProductosRoutes from "./Inventario/routes/modelosProductos.routes.js";
import instrumentoRoutes from "./Inventario/routes/Instrumentos.routes.js";
import instrumentoUbicacionRoutes from "./Inventario/routes/instrumentosUbicacion.routes.js";
import productosRoutes from "./Inventario/routes/productos.routes.js";
import productosUbicacionRoutes from "./Inventario/routes/productosUbicacion.routes.js";
import repuestosRoutes from "./Inventario/routes/repuestos.routes.js"

const app = express();

// Middlewares
app.use(cors()); 
app.use(morgan("dev"));
app.use(json());
app.use(stc("public"));

app.use("/api/inventario/almacen", almacenRoutes);
app.use("/api/inventario/equipos", equiposRoutes);
app.use("/api/inventario/modeloEquipos", modeloEquiposRoutes);
app.use("/api/inventario/instrumento", instrumentoRoutes);
app.use("/api/inventario/instrumentoUbicacion", instrumentoUbicacionRoutes);
app.use("/api/inventario/productos", productosRoutes);
app.use("/api/inventario/modeloProductos", modeloProductosRoutes);
app.use("/api/inventario/productosUbicacion", productosUbicacionRoutes);
app.use("/api/inventario/repuestos", repuestosRoutes);


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;