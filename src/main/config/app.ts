import prismaClient from '../singletons/prismaClient'

export class App {
  public async start (): Promise<void> {
    await prismaClient.projetosLei.create({ data: { assunto: 'teste de assunto', autor: 'teste de autor', ementa: 'teste de ementa', situacao: 'situacao', titulo: 'titulo' } })
  }
}
