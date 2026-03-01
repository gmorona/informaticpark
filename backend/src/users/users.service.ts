import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

type AppRole = 'ADMIN' | 'USER';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUserAsAdmin(data: {
    name: string;
    email: string;
    password: string;
    role?: AppRole;
    isActive?: boolean;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: (data.role || 'USER') as any,
        isActive: data.isActive ?? true,
      },
    });
  }

  async updateUserAsAdmin(
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      role?: AppRole;
    },
  ) {
    const updateData: any = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
    };

    if (data.password !== undefined) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  setActive(id: number, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  // soft delete (por ahora): desactiva la cuenta
  softDelete(id: number) {
    return this.setActive(id, false);
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
