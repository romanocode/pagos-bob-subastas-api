import express from 'express';
import { 
    getAllGarantias,
    getAllGarantiasCliente,
    getGarantiaById, 
    createGarantia, 
    updateGarantia, 
    validateGarantia,
    paidGarantia,
    invalidGarantia,
    revokedGarantia
} from '../controllers/garantiaController.js';

const router = express.Router();

/**
 * @route GET /api/garantias
 * @desc Obtiene todas las garantías
 * @access Public
 */
router.get('/', getAllGarantias);

/**
 * @route GET /api/garantias/cliente
 * @desc Obtiene todas las garantías de un cliente
 * @access Public
 */
router.get('/cliente/:id', getAllGarantiasCliente);

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
 * @route PATCH /api/garantias/:id/validate
 * @desc Valida una garantía
 * @access Public
 */
router.patch('/:id/validate', validateGarantia);

/**
 * @route PATCH /api/garantias/:id/paid
 * @desc Marca una garantía como pagada
 * @access Public
 */
router.patch('/:id/paid', paidGarantia);

/**
 * @route PATCH /api/garantias/:id/invalid
 * @desc Invalida una garantía
 * @access Public
 */
router.patch('/:id/invalid', invalidGarantia);

/**
 * @route PATCH /api/garantias/:id/revoke
 * @desc Revoca una garantía
 * @access Public
 */
router.patch('/:id/revoke', revokedGarantia);

export default router;