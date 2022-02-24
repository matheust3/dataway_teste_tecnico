import { PrismaClient } from '@prisma/client'
class Singleton {
  private static instance?: Singleton
  readonly obj: PrismaClient

  private constructor () {
    this.obj = new PrismaClient({
      datasources: {
        db: {
          url: process.env.NODE_ENV === 'test' ? 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/dev_miner?replicaSet=rs0&readPreference=primary&ssl=false' : 'mongodb+srv://nightmoon:Ng7PAoBrkWNTBl1q@cluster0.e2b50.mongodb.net/nightmoon'
        }

      }
    })
  }

  static getInstance (): Singleton {
    if (Singleton.instance === undefined) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}

export default Singleton.getInstance().obj
