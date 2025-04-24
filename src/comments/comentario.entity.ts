import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Usuario } from '../users/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@ObjectType()
@Entity()
export class Comentario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  contenido: string;

  @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  usuario: Usuario;
}
