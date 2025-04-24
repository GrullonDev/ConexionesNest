import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly repo: Repository<Comentario>,
  ) { }

  findAll() {
    return this.repo.find({ relations: ['usuario'] });
  }

  create(data: Partial<Comentario>) {
    const comentario = this.repo.create(data);
    return this.repo.save(comentario);
  }

  async update(id: number, contenido: string): Promise<Comentario> {
    const comentario = await this.repo.findOneBy({ id });
    if (!comentario) throw new Error('Comentario no encontrado');
    comentario.contenido = contenido;
    return this.repo.save(comentario);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
