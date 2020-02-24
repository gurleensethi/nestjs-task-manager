import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';

const mockCredentialsDto: AuthCredentialsDto = {
  username: 'testing',
  password: 'testing',
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save: jest.Mock;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('saves a new user successfully', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws an error', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws an error', () => {
      save.mockRejectedValue({ code: '123123' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUser', () => {
    let user: User;

    beforeEach(() => {
      user = new User();
      user.username = 'testing';
      user.password = 'testing';
    });

    it('returns the username as validation is successfull', () => {
      userRepository.findOne = jest.fn().mockResolvedValue(user);
      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue(user.username);
    });
  });
});
