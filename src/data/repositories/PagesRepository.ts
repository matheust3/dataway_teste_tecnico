import type { CardData } from '../../domain/models/CardData'
import type { DraftLaw } from '../../domain/models/DraftLaw'
import type { IPagesRepository } from '../../domain/repositories/IPagesRepository'
import type { ICardsDatasource } from '../datasource/ICardsDatasource'
import type { IDraftLawDatasource } from '../datasource/IDraftLawDatasource'

export class PagesRepository implements IPagesRepository {
  constructor (
    private readonly _cardsDatasource: ICardsDatasource,
    private readonly _draftLawDatasource: IDraftLawDatasource
  ) {}

  async getCardsDataFromCardsPageUrl (url: string): Promise<CardData[]> {
    return await this._cardsDatasource.getCardsFromUrl(url)
  }

  async getDraftLawDataFromCard (card: CardData): Promise<DraftLaw> {
    return await this._draftLawDatasource.getDraftLawDataFromCard(card)
  }

  async persistDraftLawData (data: DraftLaw): Promise<void> {
    await this._draftLawDatasource.persist(data)
  }
}
