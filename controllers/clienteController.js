import prisma from '../lib/db.js';

/**
 * Obtiene todos los clientes
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllClientes = async (req, res) => {
    try {
        const clientes = await prisma.clientes.findMany();
        return res.status(200).json({
            success: true,
            data: clientes,
            message: 'Clientes obtenidos correctamente'
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener clientes',
            error: error.message
        });
    }
}

/**
 * Obtiene un cliente por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getClienteById = async (req, res) => {
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
        
        const cliente = await prisma.clientes.findUnique({
            where: { idCliente: clienteId }
        });
        
        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: `Cliente con ID ${clienteId} no encontrado`
            });
        }
        
        return res.status(200).json({
            success: true,
            data: cliente,
            message: 'Cliente obtenido correctamente'
        });
    } catch (error) {
        console.error('Error al obtener cliente por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener cliente',
            error: error.message
        });
    }
}

/**
 * Crea un nuevo cliente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createCliente = async (req, res) => {
    try {
        const { 
            correo, 
            nombreCompleto, 
            tipDocumento, 
            numDocumento, 
            numCelular, 
            saldoTotalDolar, 
            dtFacRuc, 
            dtFacRazonSocial, 
            estado 
        } = req.body;
        
        // Validaciones básicas
        if (!correo || !nombreCompleto || !tipDocumento || !numDocumento || !numCelular || !dtFacRuc || !dtFacRazonSocial) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos obligatorios deben ser proporcionados'
            });
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo no es válido'
            });
        }
        
        // Verificar si ya existe un cliente con ese correo
        const existingCliente = await prisma.clientes.findFirst({
            where: { correo }
        });
        
        if (existingCliente) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un cliente con ese correo'
            });
        }
        
        // Crear el cliente
        const newCliente = await prisma.clientes.create({
            data: {
                correo,
                nombreCompleto,
                tipDocumento,
                numDocumento,
                numCelular,
                saldoTotalDolar: saldoTotalDolar ? parseFloat(saldoTotalDolar) : 0,
                dtFacRuc,
                dtFacRazonSocial,
                activo: estado !== undefined ? estado : true,
                createdAt: new Date()
            }
        });
        
        return res.status(201).json({
            success: true,
            data: newCliente,
            message: 'Cliente creado correctamente'
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear cliente',
            error: error.message
        });
    }
}

/**
 * Actualiza un cliente existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            correo, 
            nombreCompleto, 
            tipDocumento, 
            numDocumento, 
            numCelular, 
            saldoTotalDolar, 
            dtFacRuc, 
            dtFacRazonSocial, 
            estado 
        } = req.body;
        
        // Validar que el ID sea un número
        const clienteId = parseInt(id);
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
        
        // Validar formato de email si se proporciona
        if (correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato del correo no es válido'
                });
            }
            
            // Verificar si ya existe otro cliente con ese correo
            const clienteWithEmail = await prisma.clientes.findFirst({
                where: { 
                    correo,
                    NOT: { idCliente: clienteId }
                }
            });
            
            if (clienteWithEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe otro cliente con ese correo'
                });
            }
        }
        
        // Actualizar el cliente
        const updatedCliente = await prisma.clientes.update({
            where: { idCliente: clienteId },
            data: {
                ...(correo && { correo }),
                ...(nombreCompleto && { nombreCompleto }),
                ...(tipDocumento && { tipDocumento }),
                ...(numDocumento && { numDocumento }),
                ...(numCelular && { numCelular }),
                ...(saldoTotalDolar !== undefined && { saldoTotalDolar: parseFloat(saldoTotalDolar) }),
                ...(dtFacRuc && { dtFacRuc }),
                ...(dtFacRazonSocial && { dtFacRazonSocial }),
                ...(estado !== undefined && { activo: estado }),
                updatedAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedCliente,
            message: 'Cliente actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar cliente',
            error: error.message
        });
    }
}

/**
 * Elimina un cliente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const deleteCliente = async (req, res) => {
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
        
        // Actualizar el cliente para marcarlo como cancelado en lugar de eliminarlo
        const updatedCliente = await prisma.clientes.update({
            where: { idCliente: clienteId },
            data: {
                estado: false,
                canceledAt: new Date()
            }
        });
        
        return res.status(200).json({
            success: true,
            message: 'Cliente marcado como eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar cliente',
            error: error.message
        });
    }
}

/**
 * Cambia el estado del cliente y registra la fecha de cancelación
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const changeClienteStatus = async (req, res) => {
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
        
        // Alternar estado y actualizar canceledAt si se está desactivando
        const newStatus = !existingCliente.estado;
        const updatedCliente = await prisma.clientes.update({
            where: { idCliente: clienteId },
            data: {
                estado: newStatus,
                ...(newStatus === false && { canceledAt: new Date() })
            }
        });
        
        return res.status(200).json({
            success: true,
            data: updatedCliente,
            message: `Estado del cliente cambiado a ${newStatus ? 'activo' : 'inactivo'} correctamente`
        });
    } catch (error) {
        console.error('Error al cambiar estado del cliente:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cambiar estado del cliente',
            error: error.message
        });
    }
}
