import express from 'express';
import { 
    getAllClientes, 
    getClienteById, 
    createCliente, 
    updateCliente, 
    deleteCliente,
    changeClienteStatus,
} from '../controllers/clienteController.js';

const router = express.Router();

/**
 * @route GET /api/clientes
 * @desc Obtiene todos los clientes
 * @access Public
 */
router.get('/', getAllClientes);

/**
 * @route GET /api/clientes/:id
 * @desc Obtiene un cliente por su ID
 * @access Public
 */
router.get('/:id', getClienteById);

/**
 * @route POST /api/clientes
 * @desc Crea un nuevo cliente
 * @access Public
 */
router.post('/', createCliente);

/**
 * @route PUT /api/clientes/:id
 * @desc Actualiza un cliente existente
 * @access Public
 */
router.put('/:id', updateCliente);

/**
 * @route DELETE /api/clientes/:id
 * @desc Elimina un cliente
 * @access Public
 */
router.delete('/:id', deleteCliente);

/**
 * @route PATCH /api/clientes/:id
 * @desc Cambia el estado de un cliente
 * @access Public
 */
router.patch('/:id', changeClienteStatus);




export default router;