import { createGroup, deleteGroup } from './group-service';
import groupDal from '../../data-access/group/group-dal';
import {
  GroupCreationRequestDTO,
  GroupDomain,
} from '../../models/group-model';

jest.mock('../../data-access/group/group-dal', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {}),
  };
});

describe('group service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('group creation', () => {
    const groupMock: GroupCreationRequestDTO = {
      name: 'name1',
      permissions: ['READ', 'WRITE'],
    };

    test('should create group', async (done) => {
      groupDal.getGroupDataByName = jest.fn().mockResolvedValue(null);
      groupDal.createGroupData = jest.fn().mockResolvedValue(groupMock);

      const group: GroupDomain | null = await createGroup(groupMock);

      expect(groupDal.getGroupDataByName).toBeCalledWith('name1');
      expect(groupDal.createGroupData).toBeCalledWith(groupMock);
      expect(group).toEqual(groupMock);

      done();
    });

    test('should not create duplicated group', async (done) => {
      groupDal.getGroupDataByName = jest.fn().mockResolvedValue(groupMock);

      try {
        await createGroup(groupMock);
      } catch (e) {
        expect(e.errorMessage).toEqual('Duplicated name');
      }

      expect(groupDal.getGroupDataByName).toBeCalledWith('name1');
      expect(groupDal.createGroupData).not.toBeCalled();

      done();
    });
  });

  describe('group deleting', () => {
    const groupMock: GroupCreationRequestDTO = {
      name: 'name1',
      permissions: ['READ', 'WRITE'],
    };

    test('should delete group', async (done) => {
      groupDal.deleteGroupData = jest.fn().mockResolvedValue(groupMock);

      const group: GroupDomain | null = await deleteGroup('id1');

      expect(groupDal.deleteGroupData).toBeCalledWith('id1');
      expect(group).toEqual(groupMock);

      done();
    });

    test('should not delete undefined group', async (done) => {
      groupDal.deleteGroupData = jest.fn().mockResolvedValue(null);

      try {
        await deleteGroup('id1');
      } catch (e) {
        expect(e.errorMessage).toEqual('Undefined group');
      }

      expect(groupDal.deleteGroupData).toBeCalledWith('id1');

      done();
    });
  });
});
