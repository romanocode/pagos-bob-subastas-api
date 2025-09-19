import prisma from '../lib/db.js';

/**
 * Obtiene todas las facturaciones
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllFacturaciones = async (req, res) => {
    try {
        const facturaciones = await prisma.facturacion.findMany();
        return res.status(200).json({
            success: true,
            data: facturaciones,
            message: 'Facturaciones obtenidas correctamente'
        });
    } catch (error) {
        console.error('Error al obtener facturaciones:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener facturaciones',
            error: error.message
        });
    }
}

/**
 * Obtiene una facturación por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getFacturacionById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const facturacionId = parseInt(id);
        if (isNaN(facturacionId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la facturación debe ser un número válido'
            });
        }
        
        const facturacion = await prisma.facturacion.findUnique({
            where: { idFacturacion: facturacionId }
        });
        
        if (!facturacion) {
            return res.status(404).json({
                success: false,
                message: `Facturación con ID ${facturacionId} no encontrada`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: facturacion,
            message: 'Facturación obtenida correctamente'
        });
    } catch (error) {
        console.error('Error al obtener facturación por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener facturación',
            error: error.message
        });
    }
}

/**
 * Crea una nueva facturación
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createFacturacion = async (req, res) => {
    try {
        const { 
            idCliente,
            idSubasta,
            monto,
            banco,
            numCuentaDeposito,
            docAdjunto,
            concepto,
            comentarios
        } = req.body;
        
        // Validaciones básicas
        if (!idCliente || !idSubasta || !monto || !banco || !numCuentaDeposito || !concepto) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser proporcionados'
            });
        }
        
        // Validar que el ID del cliente sea un número
        const clienteId = parseInt(idCliente);
        if (isNaN(clienteId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del cliente debe ser un número válido'
            });
        }
        
        // Verificar que el cliente exista
        const existingCliente = await prisma.clientes.findUnique({
            where: { idCliente: clienteId }
        });
        
        if (!existingCliente) {
            return res.status(404).json({
                success: false,
                message: `Cliente con ID ${clienteId} no encontrado`
            });
        }
        
        // Validar que el ID de la subasta sea un número
        const subastaId = parseInt(idSubasta);
        if (isNaN(subastaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la subasta debe ser un número válido'
            });
        }
        
        // Verificar que la subasta exista
        const existingSubasta = await prisma.subastas.findUnique({
            where: { idSubasta: subastaId }
        });
        
        if (!existingSubasta) {
            return res.status(404).json({
                success: false,
                message: `Subasta con ID ${subastaId} no encontrada`
            });
        }
        
        // Crear la facturación
        const newFacturacion = await prisma.facturacion.create({
            data: {
                idCliente: clienteId,
                idSubasta: subastaId,
                monto: parseFloat(monto),
                banco,
                numCuentaDeposito,
                docAdjunto,
                concepto,
                comentarios,
                createdAt: new Date()
            }
        });
        
        return res.status(201).json({
            success: true,
            data: newFacturacion,
            message: 'Facturación creada correctamente'
        });
    } catch (error) {
        console.error('Error al crear facturación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear facturación',
            error: error.message
        });
    }
}

/**
 * Actualiza una facturación existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateFacturacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            idCliente,
            idSubasta,
            monto,
            banco,
            numCuentaDeposito,
            docAdjunto,
            concepto,
            comentarios
        } = req.body;
        
        // Validar que el ID sea un número
        const facturacionId = parseInt(id);
        if (isNaN(facturacionId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la facturación debe ser un número válido'
            });
        }
        
        // Verificar que la facturación exista
        const existingFacturacion = await prisma.facturacion.findUnique({
            where: { idFacturacion: facturacionId }
        });
        
        if (!existingFacturacion) {
            return res.status(404).json({
                success: false,
                message: `Facturación con ID ${facturacionId} no encontrada`
            });
        }
        
        // Validar cliente si se proporciona
        if (idCliente) {
            const clienteId = parseInt(idCliente);
            if (isNaN(clienteId)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID del cliente debe ser un número válido'
                });
            }
            
            const existingCliente = await prisma.clientes.findUnique({
                where: { idCliente: clienteId }
            });
            
            if (!existingCliente) {
                return res.status(404).json({
                    success: false,
                    message: `Cliente con ID ${clienteId} no encontrado`
                });
            }
        }
        
        // Validar subasta si se proporciona
        if (idSubasta) {
            const subastaId = parseInt(idSubasta);
            if (isNaN(subastaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de la subasta debe ser un número válido'
                });
            }
            
            const existingSubasta = await prisma.subastas.findUnique({
                where: { idSubasta: subastaId }
            });
            
            if (!existingSubasta) {
                return res.status(404).json({
                    success: false,
                    message: `Subasta con ID ${subastaId} no encontrada`
                });
            }
        }
        
        // Actualizar la facturación
        const updatedFacturacion = await prisma.facturacion.update({
            where: { idFacturacion: facturacionId },
            data: {
                ...(idCliente && { idCliente: parseInt(idCliente) }),
                ...(idSubasta && { idSubasta: parseInt(idSubasta) }),
                ...(monto !== undefined && { monto: parseFloat(monto) }),
                ...(banco && { banco }),
                ...(numCuentaDeposito && { numCuentaDeposito }),
                ...(docAdjunto !== undefined && { docAdjunto }),
                ...(concepto && { concepto }),
                ...(comentarios !== undefined && { comentarios }),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedFacturacion,
            message: 'Facturación actualizada correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar facturación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar facturación',
            error: error.message
        });
    }
}

/**
 * Valida una facturación
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const validateFacturacion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const facturacionId = parseInt(id);
        if (isNaN(facturacionId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la facturación debe ser un número válido'
            });
        }
        
        // Verificar que la facturación exista
        const existingFacturacion = await prisma.facturacion.findUnique({
            where: { idFacturacion: facturacionId }
        });
        
        if (!existingFacturacion) {
            return res.status(404).json({
                success: false,
                message: `Facturación con ID ${facturacionId} no encontrada`
            });
        }
        
        // Validar la facturación
        const validatedFacturacion = await prisma.facturacion.update({
            where: { idFacturacion: facturacionId },
            data: {
                validatedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: validatedFacturacion,
            message: 'Facturación validada correctamente'
        });
    } catch (error) {
        console.error('Error al validar facturación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al validar facturación',
            error: error.message
        });
    }
}

/**
 * Revoca una facturación
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const revokeFacturacion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const facturacionId = parseInt(id);
        if (isNaN(facturacionId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la facturación debe ser un número válido'
            });
        }
        
        // Verificar que la facturación exista
        const existingFacturacion = await prisma.facturacion.findUnique({
            where: { idFacturacion: facturacionId }
        });
        
        if (!existingFacturacion) {
            return res.status(404).json({
                success: false,
                message: `Facturación con ID ${facturacionId} no encontrada`
            });
        }
        
        // Revocar la facturación
        const revokedFacturacion = await prisma.facturacion.update({
            where: { idFacturacion: facturacionId },
            data: {
                revokedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: revokedFacturacion,
            message: 'Facturación revocada correctamente'
        });
    } catch (error) {
        console.error('Error al revocar facturación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al revocar facturación',
            error: error.message
        });
    }
}