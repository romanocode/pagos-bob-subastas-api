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
 * Obtiene una garantía por su ID
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
        
        // Validaciones básicas
        if (!idCliente || !tipo || !fechaSubasta || !moneda || !montoGarantia || !banco || !numCuentaDeposito || !docAdjunto) {
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
        
        // Crear la garantía
        const newGarantia = await prisma.garantias.create({
            data: {
                idCliente: clienteId,
                tipo,
                placaVehiculo,
                empresaVehiculo,
                fechaSubasta: new Date(fechaSubasta),
                moneda,
                montoGarantia: parseFloat(montoGarantia),
                banco,
                numCuentaDeposito,
                docAdjunto,
                comentarios,
                estado: estado || 'PV', // PV = Pendiente de Validación
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
 * Elimina una garantía
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
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
            where: { idGarantia: garantiaId }
        });
        
        if (!existingGarantia) {
            return res.status(404).json({
                success: false,
                message: `Garantía con ID ${garantiaId} no encontrada`
            });
        }
        
        // Actualizar la garantía para marcarla como cancelada en lugar de eliminarla
        const canceledGarantia = await prisma.garantias.update({
            where: { idGarantia: garantiaId },
            data: {
                estado: 'cancelada',
                canceledAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            message: 'Garantía cancelada correctamente'
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

