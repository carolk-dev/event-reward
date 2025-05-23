import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 이메일 중복 확인
      const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
      if (existingUser) {
        throw new ConflictException("이미 사용 중인 이메일입니다.");
      }

      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`ID가 ${id}인 사용자를 찾을 수 없습니다.`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`이메일이 ${email}인 사용자를 찾을 수 없습니다.`);
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.findByEmail(email);
    if (user && (await this.comparePassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async setRole(userId: string, role: string): Promise<User> {
    const user = await this.findOne(userId);
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true }).exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);

    // 이메일이 변경되는 경우 중복 확인
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      if (existingUser) {
        throw new ConflictException("이미 사용 중인 이메일입니다.");
      }
    }

    // 비밀번호가 포함된 경우 해싱 처리
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true }).exec();
  }

  async remove(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    return this.userModel.findByIdAndDelete(userId).exec();
  }

  private async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
