import { Router } from "express";
import { userController } from "../../controllers/backend/userController";


const UserRoutes = Router();

UserRoutes.get('/', userController.getUsers);
UserRoutes.get('/getUserId', userController.getUserById);
UserRoutes.post('/CreateUser', userController.createUser);
UserRoutes.put('/updataUser', userController.updateUser);
UserRoutes.delete('/deleteUser', userController.deleteUser);

export default UserRoutes;