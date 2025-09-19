import express from 'express';
import { 
    getAllFacturaciones, 
    getFacturacionById, 
    createFacturacion, 
    updateFacturacion, 
    validateFacturacion,
    revokeFacturacion
} from '../controllers/facturacionController.js';

const router = express.Router();

/**
 * @route GET /api/facturacion
 * @desc Obtiene todas las facturaciones
 * @access Public
 */
router.get('/', getAllFacturaciones);

/**
 * @route GET /api/facturacion/:id
 * @desc Obtiene una facturación por su ID
 * @access Public
 */
router.get('/:id', getFacturacionById);

/**
 * @route POST /api/facturacion
 * @desc Crea una nueva facturación
 * @access Private
 */
router.post('/', createFacturacion);

/**
 * @route PUT /api/facturacion/:id
 * @desc Actualiza una facturación existente
 * @access Private
 */
router.put('/:id', updateFacturacion);

/**
 * @route PATCH /api/facturacion/:id/validate
 * @desc Valida una facturación
 * @access Private
 */
router.patch('/:id/validate', validateFacturacion);

/**
 * @route PATCH /api/facturacion/:id/revoke
 * @desc Revoca una facturación
 * @access Private
 */
router.patch('/:id/revoke', revokeFacturacion);

export default router;