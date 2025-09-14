import prisma from '../lib/db.js';

/**
 * Obtiene todos los usuarios
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.usuario.findMany();
        return res.status(200).json({
            success: true,
            data: users,
            message: 'Usuarios obtenidos correctamente'
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
}

/**
 * Obtiene un usuario por su ID
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea un número
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del usuario debe ser un número válido'
            });
        }

        const user = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Usuario con ID ${userId} no encontrado`
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
            message: 'Usuario obtenido correctamente'
        });
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
}

/**
 * Crea un nuevo usuario
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const createUser = async (req, res) => {
    try {
        const { email, nombre, telefono, tipo_usuario } = req.body;

        // Validaciones básicas
        if (!email || !nombre || !tipo_usuario) {
            return res.status(400).json({
                success: false,
                message: 'Los campos email, nombre y tipo_usuario son obligatorios'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'El formato del email no es válido'
            });
        }

        // Verificar si ya existe un usuario con ese email
        const existingUser = await prisma.usuario.findFirst({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un usuario con ese email'
            });
        }

        // Crear el usuario
        const newUser = await prisma.usuario.create({
            data: {
                email,
                nombre,
                telefono,
                tipo_usuario,
                fecha_creacion: new Date()
            }
        });

        return res.status(201).json({
            success: true,
            data: newUser,
            message: 'Usuario creado correctamente'
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
}

/**
 * Actualiza un usuario existente
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, nombre, telefono, tipo_usuario, esta_activo } = req.body;

        // Validar que el ID sea un número
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del usuario debe ser un número válido'
            });
        }

        // Verificar que el usuario exista
        const existingUser = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: `Usuario con ID ${userId} no encontrado`
            });
        }

        // Validar formato de email si se proporciona
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato del email no es válido'
                });
            }

            // Verificar si ya existe otro usuario con ese email
            const userWithEmail = await prisma.usuario.findFirst({
                where: { 
                    email,
                    NOT: { id: userId }
                }
            });

            if (userWithEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe otro usuario con ese email'
                });
            }
        }

        // Actualizar el usuario
        const updatedUser = await prisma.usuario.update({
            where: { id: userId },
            data: {
                ...(email && { email }),
                ...(nombre && { nombre }),
                ...(telefono !== undefined && { telefono }),
                ...(tipo_usuario && { tipo_usuario }),
                ...(esta_activo !== undefined && { esta_activo }),
                fecha_actualizacion: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
}

/**
 * Elimina un usuario
 * @param {Request} req - Objeto de solicitud Express
 * @param {Response} res - Objeto de respuesta Express
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea un número
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: 'El ID del usuario debe ser un número válido'
            });
        }

        // Verificar que el usuario exista
        const existingUser = await prisma.usuario.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: `Usuario con ID ${userId} no encontrado`
            });
        }

        // Eliminar el usuario
        await prisma.usuario.delete({
            where: { id: userId }
        });

        return res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
}
