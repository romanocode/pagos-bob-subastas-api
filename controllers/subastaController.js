import prisma from '../lib/db.js';

/**
 * Obtiene todas las subastas
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllSubastas = async (req, res) => {
    try {
        const subastas = await prisma.subastas.findMany();
        return res.status(200).json({
            success: true,
            data: subastas,
            message: 'Subastas obtenidas correctamente'
        });
    } catch (error) {
        console.error('Error al obtener subastas:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener subastas',
            error: error.message
        });
    }
}

/**
 * Obtiene una subasta por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getSubastaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const subastaId = parseInt(id);
        if (isNaN(subastaId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID de la subasta debe ser un número válido'
            });
        }
        
        const subasta = await prisma.subastas.findUnique({
            where: { idSubasta: subastaId }
        });
        
        if (!subasta) {
            return res.status(404).json({
                success: false,
                message: `Subasta con ID ${subastaId} no encontrada`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: subasta,
            message: 'Subasta obtenida correctamente'
        });
    } catch (error) {
        console.error('Error al obtener subasta por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener subasta',
            error: error.message
        });
    }
}

/**
 * Crea una nueva subasta
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createSubasta = async (req, res) => {
    try {
        const { 
            titulo,
            imgSubasta,
            placaVehiculo,
            empresa,
            fecha,
            moneda,
            monto,
            descripcion,
            estado
        } = req.body;
        
        // Validaciones básicas
        if (!titulo || !placaVehiculo || !empresa || !fecha || !moneda || !monto || !estado) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser proporcionados'
            });
        }
        
        // Crear la subasta
        const newSubasta = await prisma.subastas.create({
            data: {
                titulo,
                imgSubasta,
                placaVehiculo,
                empresa,
                fecha: new Date(fecha),
                moneda,
                monto: parseFloat(monto),
                descripcion,
                estado: estado || 'ABIERTO',
                createdAt: new Date()
            }
        });
        
        return res.status(201).json({
            success: true,
            data: newSubasta,
            message: 'Subasta creada correctamente'
        });
    } catch (error) {
        console.error('Error al crear subasta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear subasta',
            error: error.message
        });
    }
}

/**
 * Actualiza una subasta existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateSubasta = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            titulo,
            imgSubasta,
            placaVehiculo,
            empresa,
            fecha,
            moneda,
            monto,
            descripcion,
            estado
        } = req.body;
        
        // Validar que el ID sea un número
        const subastaId = parseInt(id);
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
        
        // Actualizar la subasta
        const updatedSubasta = await prisma.subastas.update({
            where: { id: subastaId },
            data: {
                ...(titulo && { titulo }),
                ...(imgSubasta !== undefined && { imgSubasta }),
                ...(placaVehiculo && { placaVehiculo }),
                ...(empresa && { empresa }),
                ...(fecha && { fecha: new Date(fecha) }),
                ...(moneda && { moneda }),
                ...(monto !== undefined && { monto: parseFloat(monto) }),
                ...(descripcion !== undefined && { descripcion }),
                ...(estado && { estado }),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedSubasta,
            message: 'Subasta actualizada correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar subasta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar subasta',
            error: error.message
        });
    }
}

/**
 * Elimina una subasta
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const deleteSubasta = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        const subastaId = parseInt(id);
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
        
        // Marcar como cancelada en lugar de eliminar
        const canceledSubasta = await prisma.subastas.update({
            where: { id: subastaId },
            data: {
                estado: 'CANCELADA',
                canceledAt: new Date(),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: canceledSubasta,
            message: 'Subasta cancelada correctamente'
        });
    } catch (error) {
        console.error('Error al cancelar subasta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cancelar subasta',
            error: error.message
        });
    }
}

export const closeSubasta = async (req, res) => {
    try {
        const { id } = req.params;
        const subastaId = parseInt(id);
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
        const closedSubasta = await prisma.subastas.update({
            where: { id: subastaId },
            data: {
                estado: 'CERRADA',
                canceledAt: new Date(),
                updatedAt: new Date()
            }
        });
        return res.status(200).json({
            success: true,
            data: closedSubasta,
            message: 'Subasta cerrada correctamente'
        })
    } catch (error) {
        console.error('Error al cerrar subasta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cerrar subasta',
            error: error.message
        });
    }
}