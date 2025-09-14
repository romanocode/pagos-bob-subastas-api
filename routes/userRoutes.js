import { Router } from "express";
import { 
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js'

export const userRoutes = Router();

/**
 * @route GET /api/users
 * @desc Obtiene todos los usuarios
 * @access Public
 */
userRoutes.get("/", getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Obtiene un usuario por su ID
 * @access Public
 */
userRoutes.get("/:id", getUserById);

/**
 * @route POST /api/users
 * @desc Crea un nuevo usuario
 * @access Public
 */
userRoutes.post("/", createUser);

/**
 * @route PUT /api/users/:id
 * @desc Actualiza un usuario existente
 * @access Public
 */
userRoutes.put("/:id", updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Elimina un usuario
 * @access Public
 */
userRoutes.delete("/:id", deleteUser);

