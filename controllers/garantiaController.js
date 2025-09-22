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
            },
            include: {
                subasta: true
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
            where: { id: garantiaId }
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
            porcentaje,
            montoGarantia,
            montoPuja,
            banco = "",
            numCuentaDeposito = "",
            docAdjunto = "",
            dtFacRuc = "",
            dtFacRazonSocial = "",
            comentarios = ""
        } = req.body;
        
        // Validaciones básicas
        if (!idCliente || !idSubasta || !concepto || !fechaSubasta || !fechaExpiracion || !tipo || !moneda || !montoGarantia || !montoPuja || !porcentaje) {
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
            where: { id: clienteId }
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
            where: { id: subastaId }
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
                porcentaje: parseFloat(porcentaje),
                montoGarantia: parseFloat(montoGarantia),
                montoPuja: parseFloat(montoPuja),
                banco,
                numCuentaDeposito,
                docAdjunto,
                dtFacRuc,
                dtFacRazonSocial,
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
            idSubasta,
            concepto,
            fechaSubasta,
            fechaExpiracion,
            tipo,
            moneda,
            porcentaje,
            montoPuja,
            montoGarantia
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
            where: { id: garantiaId }
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
                where: { id: clienteId }
            });
            
            if (!existingCliente) {
                return res.status(404).json({
                    success: false,
                    message: `Cliente con ID ${clienteId} no encontrado`
                });
            }
        }
        
        // Si se proporciona un ID de subasta, verificar que exista
        if (idSubasta) {
            const subastaId = parseInt(idSubasta);
            if (isNaN(subastaId)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID de la subasta debe ser un número válido'
                });
            }
            
            const existingSubasta = await prisma.subastas.findUnique({
                where: { id: subastaId }
            });
            
            if (!existingSubasta) {
                return res.status(404).json({
                    success: false,
                    message: `Subasta con ID ${subastaId} no encontrada`
                });
            }
        }
        
        // Actualizar la garantía
        const updatedGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
            data: {
                ...(idCliente && { idCliente: parseInt(idCliente) }),
                ...(idSubasta && { idSubasta: parseInt(idSubasta) }),
                ...(concepto && { concepto }),
                ...(fechaSubasta && { fechaSubasta: new Date(fechaSubasta) }),
                ...(fechaExpiracion && { fechaExpiracion: new Date(fechaExpiracion) }),
                ...(tipo && { tipo }),
                ...(moneda && { moneda }),
                ...(porcentaje !== undefined && { porcentaje: parseFloat(porcentaje) }),
                ...(montoPuja !== undefined && { montoPuja: parseFloat(montoPuja) }),
                ...(montoGarantia !== undefined && { montoGarantia: parseFloat(montoGarantia) }),
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como validada
        const validatedGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
            data: {
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como invalidada
        const invalidatedGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como revocada
        const revokedGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
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

export const updateGarantiaClient = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            banco,
            numCuentaDeposito,
            docAdjunto,
            comentarios,
            dtFacRuc,
            dtFacRazonSocial,
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            })
        }
        
        // Actualizar la garantía
        const updatedGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
            data: {
                banco,
                numCuentaDeposito,
                docAdjunto,
                comentarios,
                dtFacRuc,
                dtFacRazonSocial,
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

export const sentGarantia = async (req, res) => {
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como enviada
        const sentGarantia = await prisma.garantias.update({
            where: { id: garantiaId },
            data: {
                sentedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: sentGarantia,
            message: 'Garantía enviada correctamente'
        });
    } catch (error) {
        console.error('Error al enviar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al enviar garantía',
            error: error.message
        });
    }
}

export const deleteGarantia = async (req, res) => {
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
            where: { id: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Eliminar la garantía
        await prisma.garantias.delete({
            where: { id: garantiaId }
        });
        
        return res.status(200).json({
            success: true,
            message: `Garantía con ID ${garantiaId} eliminada correctamente`
        });
    } catch (error) {
        console.error('Error al eliminar garantía:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar garantía',
            error: error.message
        });
    }
}
