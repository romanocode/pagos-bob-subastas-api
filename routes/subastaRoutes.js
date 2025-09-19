import express from 'express';
import { 
    getAllSubastas, 
    getSubastaById, 
    createSubasta, 
    updateSubasta, 
    deleteSubasta 
} from '../controllers/subastaController.js';

const router = express.Router();

/**
 * @route GET /api/subastas
 * @desc Obtiene todas las subastas
 * @access Public
 */
router.get('/', getAllSubastas);

/**
 * @route GET /api/subastas/:id
 * @desc Obtiene una subasta por su ID
 * @access Public
 */
router.get('/:id', getSubastaById);

/**
 * @route POST /api/subastas
 * @desc Crea una nueva subasta
 * @access Private
 */
router.post('/', createSubasta);

/**
 * @route PUT /api/subastas/:id
 * @desc Actualiza una subasta existente
 * @access Private
 */
router.put('/:id', updateSubasta);

/**
 * @route DELETE /api/subastas/:id
 * @desc Elimina una subasta
 * @access Private
 */
router.delete('/:id', deleteSubasta);

export default router;