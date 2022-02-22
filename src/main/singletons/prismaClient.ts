import { PrismaClient } from '@prisma/client'
class Singleton {
  private static instance?: Singleton
  readonly obj: PrismaClient

  private constructor () {
    this.obj = new PrismaClient()
  }

  static getInstance (): Singleton {
    if (Singleton.instance === undefined) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}

export default Singleton.getInstance().obj
