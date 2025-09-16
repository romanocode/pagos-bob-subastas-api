import express from 'express';
import { 
    getAllGarantias, 
    getGarantiaById, 
    createGarantia, 
    updateGarantia, 
    deleteGarantia,
    validateGarantia
} from '../controllers/garantiaController.js';

const router = express.Router();

/**
 * @route GET /api/garantias
 * @desc Obtiene todas las garantías
 * @access Public
 */
router.get('/', getAllGarantias);

/**
 * @route GET /api/garantias/:id
 * @desc Obtiene una garantía por su ID
 * @access Public
 */
router.get('/:id', getGarantiaById);

/**
 * @route POST /api/garantias
 * @desc Crea una nueva garantía
 * @access Public
 */
router.post('/', createGarantia);

/**
 * @route PUT /api/garantias/:id
 * @desc Actualiza una garantía existente
 * @access Public
 */
router.put('/:id', updateGarantia);

/**
 * @route DELETE /api/garantias/:id
 * @desc Elimina una garantía
 * @access Public
 */
router.delete('/:id', deleteGarantia);

/**
 * @route PATCH /api/garantias/:id
 * @desc Valida una garantía
 * @access Public
 */
router.patch('/:id', validateGarantia);


export default router;