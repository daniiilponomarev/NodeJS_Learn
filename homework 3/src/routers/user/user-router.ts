import express, { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import 'joi-extract-type';
import asyncHandler from 'express-async-handler';
import {
  userCreateUpdateRequestSchema,
  userCreateUpdateSchema,
  usersAddToGroupRequestSchema,
  usersAddToGroupSchema,
} from './user-schemas';
import {
  UserCreationRequestDTO,
  UsersAddToGroupRequestDTO,
} from '../../models/user-model';
import {
  addUsersToGroup,
  createUser,
  deleteUser,
  getAutoSuggestUsers,
  getUser,
  updateUser,
} from '../../services/user/user-service';
import { UserMapper } from './user-mapper';
import { CONFLICT, NOT_FOUND, OK } from '../../constants/statuses';
import { logger } from '../../utils/logger';

const userRouter: Router = express.Router();
const validator = createValidator();

userRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser(req.params.id);
    const userDTO = UserMapper.mapUserToDTO(user);

    return res.json(userDTO);
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

        return res.json(userDTO);
      } catch (error) {
        logger.error({
          message: error.errorMessage,
          method: 'createUser',
          body: JSON.stringify(req.body),
        });
        res.status(CONFLICT).json(error);
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

        return res.json(userDTO);
      } catch (error) {
        logger.error({
          message: error.errorMessage,
          method: 'updateUser',
          params: JSON.stringify(req.params),
          body: JSON.stringify(req.body),
        });
        res.status(CONFLICT).json(error);
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

    return res.json(usersDTO);
  })
);

userRouter.delete(
  '/delete/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await deleteUser(req.params.id);
      const userDTO = UserMapper.mapUserToDTO(user);

      return res.json(userDTO);
    } catch (error) {
      logger.error({
        message: error.errorMessage,
        method: 'deleteUser',
        params: JSON.stringify(req.params),
      });
      res.status(NOT_FOUND).json(error);
    }
  })
);

userRouter.put(
  '/addToGroup/:groupId',
  validator.body(usersAddToGroupSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<usersAddToGroupRequestSchema>,
      res: Response
    ) => {
      try {
        const addToGroupDTO: UsersAddToGroupRequestDTO = req.body;
        await addUsersToGroup(req.params.groupId, addToGroupDTO.userIds);

        res.status(OK).send('Done');
      } catch (error) {
        logger.error({
          message: error.errorMessage,
          method: 'addUsersToGroup',
          params: JSON.stringify(req.params),
          body: JSON.stringify(req.body),
        });
        res.status(NOT_FOUND).json(error);
      }
    }
  )
);

export default userRouter;
