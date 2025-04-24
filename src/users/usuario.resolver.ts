import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

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

  @Mutation(() => Usuario)
  async actualizarImagenUsuario(
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
    @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<Usuario> {
    const { createReadStream, filename } = file;
    const uploadsPath = join(process.cwd(), 'uploads');
    const path = join(uploadsPath, filename);

    const usuario = await this.service.findById(usuarioId);
    if (usuario.imagenUrl) {
      try {
        const prevPath = join(process.cwd(), usuario.imagenUrl);
        if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath);
      } catch (_) { }
    }

    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(path))
        .on('finish', resolve)
        .on('error', reject);
    });

    return this.service.updateImagen(usuarioId, `uploads/${filename}`);
  }

  @Mutation(() => Usuario)
  async eliminarImagenUsuario(
    @Args('usuarioId', { type: () => Int }) usuarioId: number,
  ): Promise<Usuario> {
    const usuario = await this.service.findById(usuarioId);
    if (usuario.imagenUrl) {
      const imagePath = join(process.cwd(), usuario.imagenUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      return this.service.updateImagen(usuarioId, usuario.imagenUrl);
    }
    return usuario;
  }
}
