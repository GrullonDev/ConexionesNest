import { UsuarioResolver } from './users/usuario.resolver';
import { UsuarioService } from './users/usuario.service';
import { ComentarioResolver } from './comments/comentario.resolver';
import { ComentarioService } from './comments/comentario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './users/usuario.entity';
import { Comentario } from './comments/comentario.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      csrfPrevention: false, // 👈 DESACTIVA CSRF
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'conexiones_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Usuario, Comentario]),
  ],
  providers: [
    UsuarioResolver,
    UsuarioService,
    ComentarioResolver,
    ComentarioService,
  ],
})

export class AppModule { }
