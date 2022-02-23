import type { IPagesRepository } from '../repositories/IPagesRepository'
import type { IExtractDataFromPageCardsUseCase } from './IExtractDataFromPageCardsUseCase'

export class ExtractDataFromPageCardsUseCase implements IExtractDataFromPageCardsUseCase {
  constructor (private readonly _pagesRepository: IPagesRepository) {}

  async execute (cardsPageUrl: string): Promise<boolean> {
    const result = await this._pagesRepository.getCardsDataFromCardsPageUrl(cardsPageUrl)
    for (const card of result) {
      const lawData = await this._pagesRepository.getDraftLawDataFromCard(card)
      await this._pagesRepository.persistDraftLawData(lawData)
    }
    return true
  }
}
