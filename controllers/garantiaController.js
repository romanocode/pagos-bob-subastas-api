import prisma from '../lib/db.js';

/**
 * Obtiene todas las garantías
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllGarantias = async (req, res) => {
    try {
        const garantias = await prisma.garantias.findMany();
        return res.status(200).json({
            success: true,
            data: garantias,
            message: 'Garantías obtenidas correctamente'
        });
    } catch (error) {
        console.error('Error al obtener garantías:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener garantías',
            error: error.message
        });
    }
}

/**
 * Obtiene todas las garantías
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllGarantiasCliente = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const clienteId = parseInt(id);
        if (isNaN(clienteId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del cliente debe ser un número válido'
            });
        }
        
        const garantias = await prisma.garantias.findMany({
            where: {
                idCliente: clienteId
            }
        });
        return res.status(200).json({
            success: true,
            data: garantias,
            message: 'Garantías obtenidas correctamente'
        });
    } catch (error) {
        console.error('Error al obtener garantías:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener garantías',
            error: error.message
        });
    }
}

/**
 * Obtiene una garantía por su ID
            });
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getGarantiaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        const garantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!garantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: garantia,
            message: 'Garantía obtenida correctamente'
        });
    } catch (error) {
        console.error('Error al obtener garantía por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener garantía',
            error: error.message
        });
    }
}

/**
 * Crea una nueva garantía
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createGarantia = async (req, res) => {
    try {
        const { 
            idCliente,
            idSubasta,
            concepto,
            fechaSubasta,
            fechaExpiracion,
            tipo,
            moneda,
            montoGarantia,
            banco,
            numCuentaDeposito,
            docAdjunto,
            comentarios
        } = req.body;
        
        // Validaciones básicas
        if (!idCliente || !idSubasta || !concepto || !fechaSubasta || !fechaExpiracion || !tipo || !moneda || !montoGarantia || !banco || !numCuentaDeposito || !docAdjunto) {
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
        
        // Crear la garantía
        const newGarantia = await prisma.garantias.create({
            data: {
                idCliente: clienteId,
                idSubasta: subastaId,
                concepto,
                fechaSubasta: new Date(fechaSubasta),
                fechaExpiracion: new Date(fechaExpiracion),
                tipo,
                moneda,
                montoGarantia: parseFloat(montoGarantia),
                banco,
                numCuentaDeposito,
                docAdjunto,
                comentarios,
                createdAt: new Date()
            }
        });
        
        return res.status(201).json({
            success: true,
            data: newGarantia,
            message: 'Garantía creada correctamente'
        });
    } catch (error) {
        console.error('Error al crear garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear garantía',
            error: error.message
        });
    }
}

/**
 * Actualiza una garantía existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateGarantia = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            idCliente,
            tipo,
            placaVehiculo,
            empresaVehiculo,
            fechaSubasta,
            moneda,
            montoGarantia,
            banco,
            numCuentaDeposito,
            docAdjunto,
            comentarios,
            estado
        } = req.body;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        // Verificar que la garantía exista
        const existingGarantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Si se proporciona un ID de cliente, verificar que exista
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
        
        // Actualizar la garantía
        const updatedGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                ...(idCliente && { idCliente: parseInt(idCliente) }),
                ...(tipo && { tipo }),
                ...(placaVehiculo && { placaVehiculo }),
                ...(empresaVehiculo && { empresaVehiculo }),
                ...(fechaSubasta && { fechaSubasta: new Date(fechaSubasta) }),
                ...(moneda && { moneda }),
                ...(montoGarantia !== undefined && { montoGarantia: parseFloat(montoGarantia) }),
                ...(banco && { banco }),
                ...(numCuentaDeposito && { numCuentaDeposito }),
                ...(docAdjunto && { docAdjunto }),
                ...(comentarios !== undefined && { comentarios }),
                ...(estado && { estado }),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedGarantia,
            message: 'Garantía actualizada correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar garantía',
            error: error.message
        });
    }
}

/**
 * Valida una garantía
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const validateGarantia = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        // Verificar que la garantía exista
        const existingGarantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como validada
        const validatedGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                estado: 'V', // V = Validado
                validatedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: validatedGarantia,
            message: 'Garantía validada correctamente'
        });
    } catch (error) {
        console.error('Error al validar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al validar garantía',
            error: error.message
        });
    }
}


/**
 * Marca una garantía como pagada
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const paidGarantia = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        // Verificar que la garantía exista
        const existingGarantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como pagada
        const paidGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                paidAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: paidGarantia,
            message: 'Garantía marcada como pagada correctamente'
        });
    } catch (error) {
        console.error('Error al marcar garantía como pagada:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al marcar garantía como pagada',
            error: error.message
        });
    }
}

/**
 * Invalida una garantía
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const invalidGarantia = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        // Verificar que la garantía exista
        const existingGarantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como invalidada
        const invalidatedGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                invalidatedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: invalidatedGarantia,
            message: 'Garantía invalidada correctamente'
        });
    } catch (error) {
        console.error('Error al invalidar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al invalidar garantía',
            error: error.message
        });
    }
}

/**
 * Revoca una garantía
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const revokedGarantia = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const garantiaId = parseInt(id);
        if (isNaN(garantiaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la garantía debe ser un número válido'
            });
        }
        
        // Verificar que la garantía exista
        const existingGarantia = await prisma.garantias.findUnique({
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como revocada
        const revokedGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                revokedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: revokedGarantia,
            message: 'Garantía revocada correctamente'
        });
    } catch (error) {
        console.error('Error al revocar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al revocar garantía',
            error: error.message
        });
    }
}

