import express from 'express';
import { 
    getAllReembolsos, 
    getReembolsoById, 
    createReembolso, 
    updateReembolso, 
    validateReembolso,
    revokeReembolso
} from '../controllers/reembolsoController.js';

const router = express.Router();

/**
 * @route GET /api/reembolsos
 * @desc Obtiene todos los reembolsos
 * @access Public
 */
router.get('/', getAllReembolsos);

/**
 * @route GET /api/reembolsos/:id
 * @desc Obtiene un reembolso por su ID
 * @access Public
 */
router.get('/:id', getReembolsoById);

/**
 * @route POST /api/reembolsos
 * @desc Crea un nuevo reembolso
 * @access Public
 */
router.post('/', createReembolso);

/**
 * @route PUT /api/reembolsos/:id
 * @desc Actualiza un reembolso existente
 * @access Public
 */
router.put('/:id', updateReembolso);

/**
 * @route PUT /api/reembolsos/:id/validate
 * @desc Aprobar un reembolso
 * @access Public
 */
router.put('/:id/validate', validateReembolso);

/**
 * @route PUT /api/reembolsos/:id/revoke
 * @desc Revocar un reembolso
 * @access Public
 */
router.put('/:id/revoke', revokeReembolso);

export default router;