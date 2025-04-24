import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private readonly repo: Repository<Comentario>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['usuario'] });
  }

  create(data: Partial<Comentario>) {
    const comentario = this.repo.create(data);
    return this.repo.save(comentario);
  }
}
