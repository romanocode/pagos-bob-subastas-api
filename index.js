import express from "express";
import cors from "cors";
import clienteRoutes from './routes/clienteRoutes.js';
import garantiaRoutes from './routes/garantiaRoutes.js';
import reembolsoRoutes from './routes/reembolsoRoutes.js';
import subastaRoutes from './routes/subastaRoutes.js';
import facturacionRoutes from './routes/facturacionRoutes.js';

//Crear la aplicación
const app = express();
//Definir el puerto
const port = 3000;

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type',"Authorization"]
}));

//Configurar Express para entender JSON
app.use(express.json());

//Crear nuestra primera ruta
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Hola! Mi primer servidor funciona 🎉' 
  });
});


//Usar las rutas de clientes
app.use('/api/clientes', clienteRoutes);
//Usar las rutas de garantías
app.use('/api/garantias', garantiaRoutes);
//Usar las rutas de reembolsos
app.use('/api/reembolsos', reembolsoRoutes);
//Usar las rutas de subastas
app.use('/api/subastas', subastaRoutes);
//Usar las rutas de facturación
app.use('/api/facturacion', facturacionRoutes);

//Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
});