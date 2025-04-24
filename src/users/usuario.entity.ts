import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comentario } from 'src/comments/comentario.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Usuario {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imagenUrl?: string;

  @OneToMany(() => Comentario, comentario => comentario.usuario)
  comentarios: Comentario[];
}
