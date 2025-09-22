import prisma from '../lib/db.js';

/**
 * Obtiene todos los reembolsos
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllReembolsos = async (req, res) => {
    try {
        const reembolsos = await prisma.reembolsos.findMany();
        return res.status(200).json({
            success: true,
            data: reembolsos,
            message: 'Reembolsos obtenidos correctamente'
        });
    } catch (error) {
        console.error('Error al obtener reembolsos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener reembolsos',
            error: error.message
        });
    }
}

/**
 * Obtiene todos los reembolsos de un cliente por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllReembolsosCliente = async (req, res) => {
    try {
        const { idCliente } = req.params;
        const reembolsos = await prisma.reembolsos.findMany({
            where: { idCliente: parseInt(idCliente) }
        });
        return res.status(200).json({
            success: true,
            data: reembolsos,
            message: 'Reembolsos obtenidos correctamente'
        });
    } catch (error) {
        console.error('Error al obtener reembolsos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener reembolsos',
            error: error.message
        });
    }
}

/**
 * Obtiene un reembolso por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getReembolsoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const reembolsoId = parseInt(id);
        if (isNaN(reembolsoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del reembolso debe ser un número válido'
            });
        }
        
        const reembolso = await prisma.reembolsos.findUnique({
            where: { idReembolso: reembolsoId }
        });
        
        if (!reembolso) {
            return res.status(404).json({
                success: false,
                message: `Reembolso con ID ${reembolsoId} no encontrado`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: reembolso,
            message: 'Reembolso obtenido correctamente'
        });
    } catch (error) {
        console.error('Error al obtener reembolso por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener reembolso',
            error: error.message
        });
    }
}

/**
 * Crea un nuevo reembolso
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createReembolso = async (req, res) => {
    try {
        const { 
            idCliente,
            monto,
            banco,
            numCuentaDeposito,
            docAdjunto,
            comentarios
        } = req.body;
        
        // Validaciones básicas
        if (!idCliente || !monto || !banco || !numCuentaDeposito) {
            return res.status(400).json({
                success: false,
                message: 'Los campos idCliente, monto, banco y numCuentaDeposito son obligatorios'
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
        
        // Crear el reembolso
        const newReembolso = await prisma.reembolsos.create({
            data: {
                idCliente: clienteId,
                monto: parseFloat(monto),
                banco,
                numCuentaDeposito,
                docAdjunto,
                comentarios,
                createdAt: new Date()
            }
        });
        
        return res.status(201).json({
            success: true,
            data: newReembolso,
            message: 'Reembolso creado correctamente'
        });
    } catch (error) {
        console.error('Error al crear reembolso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear reembolso',
            error: error.message
        });
    }
}

/**
 * Actualiza un reembolso existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateReembolso = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            idCliente,
            montoReembolso,
            banco,
            numCuentaDeposito,
            docAdjunto,
            comentarios,
            estado
        } = req.body;
        
        // Validar que el ID sea un número
        const reembolsoId = parseInt(id);
        if (isNaN(reembolsoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del reembolso debe ser un número válido'
            });
        }
        
        // Verificar que el reembolso exista
        const existingReembolso = await prisma.reembolsos.findUnique({
            where: { idReembolso: reembolsoId }
        });
        
        if (!existingReembolso) {
            return res.status(404).json({
                success: false,
                message: `Reembolso con ID ${reembolsoId} no encontrado`
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
        
        // Actualizar el reembolso
        const updatedReembolso = await prisma.reembolsos.update({
            where: { idReembolso: reembolsoId },
            data: {
                ...(idCliente && { idCliente: parseInt(idCliente) }),
                ...(montoReembolso !== undefined && { montoReembolso: parseFloat(montoReembolso) }),
                ...(banco && { banco }),
                ...(numCuentaDeposito && { numCuentaDeposito }),
                ...(docAdjunto !== undefined && { docAdjunto }),
                ...(comentarios !== undefined && { comentarios }),
                ...(estado && { estado }),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedReembolso,
            message: 'Reembolso actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar reembolso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar reembolso',
            error: error.message
        });
    }
}

/**
 * Valida un reembolso
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const validateReembolso = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const reembolsoId = parseInt(id);
        if (isNaN(reembolsoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del reembolso debe ser un número válido'
            });
        }
        
        // Verificar que el reembolso exista
        const existingReembolso = await prisma.reembolsos.findUnique({
            where: { idReembolso: reembolsoId }
        });
        
        if (!existingReembolso) {
            return res.status(404).json({
                success: false,
                message: `Reembolso con ID ${reembolsoId} no encontrado`
            });
        }
        
        // Actualizar el reembolso para marcarlo como aprobado
        const validatedReembolso = await prisma.reembolsos.update({
            where: { idReembolso: reembolsoId },
            data: {
                estado: 'A', // A = Aprobado
                validatedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: validatedReembolso,
            message: 'Reembolso aprobado correctamente'
        });
    } catch (error) {
        console.error('Error al aprobar reembolso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al aprobar reembolso',
            error: error.message
        });
    }
}

/**
 * Revoca un reembolso
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const revokeReembolso = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const reembolsoId = parseInt(id);
        if (isNaN(reembolsoId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del reembolso debe ser un número válido'
            });
        }
        
        // Verificar que el reembolso exista
        const existingReembolso = await prisma.reembolsos.findUnique({
            where: { idReembolso: reembolsoId }
        });
        
        if (!existingReembolso) {
            return res.status(404).json({
                success: false,
                message: `Reembolso con ID ${reembolsoId} no encontrado`
            });
        }
        
        // Actualizar el reembolso para marcarlo como revocado
        const revokedReembolso = await prisma.reembolsos.update({
            where: { idReembolso: reembolsoId },
            data: {
                estado: 'R', // R = Revocado
                revokedAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: revokedReembolso,
            message: 'Reembolso revocado correctamente'
        });
    } catch (error) {
        console.error('Error al revocar reembolso:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al revocar reembolso',
            error: error.message
        });
    }
}

