import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ComentarioService } from './comentario.service';
import { Comentario } from './comentario.entity';

@Resolver(() => Comentario)
export class ComentarioResolver {
    constructor(private readonly service: ComentarioService) { }

    @Query(() => [Comentario])
    comentarios() {
        return this.service.findAll();
    }

    @Mutation(() => Comentario)
    crearComentario(
        @Args('contenido') contenido: string,
        @Args('usuarioId', { type: () => Int }) usuarioId: number,
    ) {
        return this.service.create({
            contenido,
            usuario: {
                id: usuarioId,
                nombre: '',
                email: '',
                comentarios: []
            },
        });
    }
}
