import express, { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import 'joi-extract-type';
import asyncHandler from 'express-async-handler';
import {
  userCreateUpdateRequestSchema,
  userCreateUpdateSchema,
} from './user-schemas';
import { UserCreationRequestDTO } from '../models/user-model';
import {
  createUser,
  deleteUser,
  getAutoSuggestUsers,
  getUser,
  updateUser,
} from '../services/user-service';
import { UserMapper } from './user-mapper';

const userRouter: Router = express.Router();
const validator = createValidator();

userRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser(req.params.id);
    const userDTO = UserMapper.mapUserToDTO(user);

    res.json(userDTO);
  })
);

userRouter.post(
  '/create',
  validator.body(userCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<userCreateUpdateRequestSchema>,
      res: Response
    ) => {
      try {
        const newUser: UserCreationRequestDTO = req.body;
        const createdUser = await createUser(newUser);
        const userDTO = UserMapper.mapUserToDTO(createdUser);

        res.json(userDTO);
      } catch (error) {
        res.status(409).json(error.toString());
      }
    }
  )
);

userRouter.put(
  '/update/:login',
  validator.body(userCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<userCreateUpdateRequestSchema>,
      res: Response
    ) => {
      try {
        const user: UserCreationRequestDTO = req.body;
        const updatedUser = await updateUser(req.params.login, user);
        const userDTO = UserMapper.mapUserToDTO(updatedUser);

        res.json(userDTO);
      } catch (error) {
        res.status(409).json(error.toString());
      }
    }
  )
);

userRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { loginSubstring, limit } = req.query;

    const users = await getAutoSuggestUsers(loginSubstring, limit);
    const usersDTO = users.map((user) => UserMapper.mapUserToDTO(user));

    res.json(usersDTO);
  })
);

userRouter.delete(
  '/delete/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await deleteUser(req.params.id);
      const userDTO = UserMapper.mapUserToDTO(user);

      res.json(userDTO);
    } catch (error) {
      res.status(404).json(error.toString());
    }
  })
);

export default userRouter;
