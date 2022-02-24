import type { PrismaClient, ProjetosLei } from '@prisma/client'
import prismaClient from '../singletons/prismaClient'
import { App } from './app'

jest.setTimeout(120000)
describe('server.test.ts - handle', () => {
  let prisma: PrismaClient
  let app: App

  beforeAll(async () => {
    prisma = prismaClient
    await prisma.projetosLei.deleteMany({ where: {} })
    app = new App()
  })

  afterAll(async () => {
    await prisma.projetosLei.deleteMany({ where: {} })
  })
  test('ensure populate database with correct params', async () => {
    //! Arrange
    const expectedData: ProjetosLei[] = [
      { autor: 'Executivo', ementa: 'Dispõe sobre a alteração de dispositivos da Lei Complementar nº 541, de 26 de novembro de 2014, Plano Diretor de Chapecó - PDC e dá outras providências.', situacao: 'Parecer', assunto: 'Diversos', titulo: 'Projeto de Lei Complementar (E) 251/2021', id: 'Projeto de Lei Complementar (E) 251/2021' },
      { autor: 'Executivo LUCIANO JOSÉ BULIGON', ementa: 'Institui o Código Ambiental do município de Chapecó e dá outras providências.', situacao: 'Entrada', assunto: 'Diversos', titulo: 'Projeto de Lei Ordinária (E) 167/2019', id: 'Projeto de Lei Ordinária (E) 167/2019' },
      { autor: 'Vereador CESAR ANTONIO VALDUGA', ementa: 'Dispõe sobre a Criação do Programa de compostagem de Resíduos Orgânicos para Grandes Geradores no município de Chapecó e dá outras providências.', situacao: 'Entrada', assunto: 'Diversos', titulo: 'Projeto de Lei Ordinária (L) 33/2022', id: 'Projeto de Lei Ordinária (L) 33/2022' },
      { autor: 'Vereador WILSON JUNIOR CIDRÃO', ementa: 'Revoga leis municipais de Chapecó e dá outras providências.', situacao: 'Parecer', assunto: 'Diversos', titulo: 'Projeto de Lei Ordinária (L) 1/2022', id: 'Projeto de Lei Ordinária (L) 1/2022' }
    ]
    //! Act
    await app.start()
    const data = await prisma.projetosLei.findMany({ where: { NOT: { id: '' } }, orderBy: { autor: 'asc' } })
    //! Assert
    expect(data).toEqual(expectedData)
  })
})
