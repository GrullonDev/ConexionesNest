import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly service: UsuarioService) { }

  @Query(() => [Usuario])
  usuarios() {
    return this.service.findAll();
  }

  @Mutation(() => Usuario)
  crearUsuario(
    @Args('nombre') nombre: string,
    @Args('email') email: string,
  ) {
    return this.service.create({ nombre, email });
  }

  @Mutation(() => Usuario)
  async subirImagenUsuario(
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Usuario> {
    const { createReadStream, filename } = file;
    const uploadsPath = join(process.cwd(), 'uploads');
    const fullPath = join(uploadsPath, filename);

    // Guardar imagen
    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(fullPath))
        .on('finish', resolve)
        .on('error', reject);
    });

    // Actualizar campo imagenUrl
    const imagenUrl = `uploads/${filename}`;
    return this.service.updateImagen(usuarioId, imagenUrl);
  }
}
