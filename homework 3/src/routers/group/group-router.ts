import express, { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import 'joi-extract-type';
import asyncHandler from 'express-async-handler';
import {
  groupCreateUpdateRequestSchema,
  groupCreateUpdateSchema,
} from './group-schemas';
import {
  createGroup,
  deleteGroup,
  getGroups,
  getGroup,
  updateGroup,
} from '../../services/group-service';
import { GroupMapper } from './group-mapper';
import { GroupCreationRequestDTO } from '../../models/group-model';

const groupRouter: Router = express.Router();
const validator = createValidator();

groupRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;

    const groups = await getGroups(limit);
    const groupsDTO = groups.map((group) => GroupMapper.mapGroupToDTO(group));

    res.json(groupsDTO);
  })
);

groupRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const group = await getGroup(req.params.id);
      const groupDTO = GroupMapper.mapGroupToDTO(group);

      res.json(groupDTO);
    } catch (error) {
      res.status(404).json(error.toString());
    }
  })
);

groupRouter.post(
  '/create',
  validator.body(groupCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<groupCreateUpdateRequestSchema>,
      res: Response
    ) => {
      try {
        const newGroup: GroupCreationRequestDTO = req.body;
        const createdGroup = await createGroup(newGroup);
        const groupDTO = GroupMapper.mapGroupToDTO(createdGroup);

        res.json(groupDTO);
      } catch (error) {
        res.status(409).json(error.toString());
      }
    }
  )
);

groupRouter.put(
  '/update/:name',
  validator.body(groupCreateUpdateSchema),
  asyncHandler(
    async (
      req: ValidatedRequest<groupCreateUpdateRequestSchema>,
      res: Response
    ) => {
      try {
        const group: GroupCreationRequestDTO = req.body;
        const updatedGroup = await updateGroup(req.params.name, group);
        const groupDTO = GroupMapper.mapGroupToDTO(updatedGroup);

        res.json(groupDTO);
      } catch (error) {
        res.status(409).json(error.toString());
      }
    }
  )
);

groupRouter.delete(
  '/delete/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const group = await deleteGroup(req.params.id);
      const groupDTO = GroupMapper.mapGroupToDTO(group);

      res.json(groupDTO);
    } catch (error) {
      res.status(404).json(error.toString());
    }
  })
);

export default groupRouter;
