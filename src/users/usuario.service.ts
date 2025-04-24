import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) { }

  findAll() {
    return this.repo.find({ relations: ['comentarios'] });
  }

  create(data: Partial<Usuario>) {
    const usuario = this.repo.create(data);
    return this.repo.save(usuario);
  }

  async updateImagen(id: number, imagenUrl: string): Promise<Usuario> {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    usuario.imagenUrl = imagenUrl;
    return this.repo.save(usuario);
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }
}
