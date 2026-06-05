import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

const HASH_PREFIX = "pbkdf2";
const ITERATIONS = 120000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user || !this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return { user: this.toSafeUser(user) };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const exists = await this.users.exists({ where: { email } });
    if (exists) throw new ConflictException("Email already registered.");

    const user = this.users.create({
      id: randomUUID(),
      name: dto.name.trim(),
      email,
      passwordHash: this.hashPassword(dto.password),
      phone: dto.phone?.trim() || null,
      role: "user",
    });

    await this.users.save(user);
    return { user: this.toSafeUser(user) };
  }

  private toSafeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
    return `${HASH_PREFIX}$${ITERATIONS}$${salt}$${hash}`;
  }

  private verifyPassword(password: string, stored: string) {
    if (!stored.startsWith(`${HASH_PREFIX}$`)) {
      return stored === password;
    }

    const [, iterationsRaw, salt, hash] = stored.split("$");
    const iterations = Number(iterationsRaw);
    if (!iterations || !salt || !hash) return false;

    const actual = pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST);
    const expected = Buffer.from(hash, "hex");
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }
}
