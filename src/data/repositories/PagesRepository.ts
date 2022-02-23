import type { CardData } from '../../domain/models/CardData'
import type { DraftLaw } from '../../domain/models/DraftLaw'
import type { IPagesRepository } from '../../domain/repositories/IPagesRepository'
import type { ICardsDatasource } from '../datasource/ICardsDatasource'

export class PagesRepository implements IPagesRepository {
  constructor (private readonly _cardsDatasource: ICardsDatasource) {}

  async getCardsDataFromCardsPageUrl (url: string): Promise<CardData[]> {
    return await this._cardsDatasource.getCardsFromUrl(url)
  }

  async getDraftLawDataFromCard (card: CardData): Promise<DraftLaw> {
    throw Error('unimplemented')
  }

  async persistDraftLawData (data: DraftLaw): Promise<void> {
    throw Error('unimplemented')
  }
}
