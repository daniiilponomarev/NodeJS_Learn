import express, { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import 'joi-extract-type';
import asyncHandler from 'express-async-handler';
import {
  userCreateUpdateRequestSchema,
  userCreateUpdateSchema,
} from './schemas';
import { UserRequestType } from './types';
import {
  createUser,
  deleteUser,
  getAutoSuggestUsers,
  getUser,
  updateUser,
} from './controller';

const router: Router = express.Router();
const validator = createValidator();

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await getUser(req.params.id);

    res.json(user);
  })
);

router.post(
  '/create',
  validator.body(userCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<userCreateUpdateRequestSchema>,
      res: Response
    ) => {
      const newUser: UserRequestType = req.body;
      const createdUser = await createUser(newUser);

      res.json(createdUser);
    }
  )
);

router.put(
  '/update/:login',
  validator.body(userCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<userCreateUpdateRequestSchema>,
      res: Response
    ) => {
      const user: UserRequestType = req.body;
      const updatedUser = await updateUser(req.params.login, user);

      res.json(updatedUser);
    }
  )
);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { loginSubstring, limit } = req.query;

    const users = await getAutoSuggestUsers(loginSubstring, limit);

    res.json(users);
  })
);

router.delete(
  '/delete/:login',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await deleteUser(req.params.login);
    console.log(req.params.login);

    res.json(user);
  })
);

export default router;
