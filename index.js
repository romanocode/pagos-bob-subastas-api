import express from "express";
import { userRoutes } from './routes/userRoutes.js';

//Crear la aplicación
const app = express();
//Definir el puerto
const port = 3000;

//Configurar Express para entender JSON
app.use(express.json());

//Crear nuestra primera ruta
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '¡Hola! Mi primer servidor funciona 🎉' 
  });
});



//Usar las rutas de usuarios
app.use('/api/users', userRoutes);

//Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${port}`);
});