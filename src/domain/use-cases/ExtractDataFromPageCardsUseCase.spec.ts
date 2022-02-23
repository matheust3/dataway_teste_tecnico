import { mock, MockProxy } from 'jest-mock-extended'
import type { CardData } from '../models/CardData'
import type { IPagesRepository } from '../repositories/IPagesRepository'
import { ExtractDataFromPageCardsUseCase } from './ExtractDataFromPageCardsUseCase'

describe('ExtractDataFromPageCardsUseCase.spec.ts - execute', () => {
  let pagesRepository: MockProxy<IPagesRepository> &IPagesRepository
  let useCase: ExtractDataFromPageCardsUseCase
  let cards: CardData[]

  beforeEach(() => {
    pagesRepository = mock<IPagesRepository>()

    useCase = new ExtractDataFromPageCardsUseCase(pagesRepository)

    cards = [
      { date: new Date(), ementa: 'ementa0', moreInfoUrl: 'url0', title: 'title0' },
      { date: new Date(), ementa: 'ementa1', moreInfoUrl: 'url1', title: 'title1' },
      { date: new Date(), ementa: 'ementa2', moreInfoUrl: 'url2', title: 'title2' }
    ]
    pagesRepository.getCardsDataFromCardsPageUrl.mockResolvedValue(cards)
    pagesRepository.getDraftLawDataFromCard.mockImplementation(async (card) => await new Promise(resolve => resolve({ author: 'author', date: card.date, ementa: card.ementa, status: 'status', subject: 'subject', title: card.title, url: card.moreInfoUrl })))
  })

  test('ensure get cards data from page url', async () => {
    //! Arrange
    //! Act
    await useCase.execute('pageUrl')
    //! Assert
    expect(pagesRepository.getCardsDataFromCardsPageUrl).toHaveBeenCalledWith('pageUrl')
  })

  test('ensure get draft law data for each card', async () => {
    //! Arrange
    //! Act
    await useCase.execute('pageUrl')
    //! Assert
    expect(pagesRepository.getDraftLawDataFromCard.mock.calls).toEqual([
      [cards[0]],
      [cards[1]],
      [cards[2]]
    ])
  })

  test('ensure persist draft law data', async () => {
    //! Arrange
    //! Act
    await useCase.execute('pageUrl')
    //! Assert
    expect(pagesRepository.persistDraftLawData.mock.calls).toEqual([
      [{ author: 'author', date: cards[0].date, ementa: cards[0].ementa, status: 'status', subject: 'subject', title: cards[0].title, url: cards[0].moreInfoUrl }],
      [{ author: 'author', date: cards[1].date, ementa: cards[1].ementa, status: 'status', subject: 'subject', title: cards[1].title, url: cards[1].moreInfoUrl }],
      [{ author: 'author', date: cards[2].date, ementa: cards[2].ementa, status: 'status', subject: 'subject', title: cards[2].title, url: cards[2].moreInfoUrl }]
    ])
  })

  test('ensure return true', async () => {
    //! Arrange
    //! Act
    const result = await useCase.execute('pageUrl')
    //! Assert
    expect(result).toBe(true)
  })

  test('ensure throws if pages repository throws', async () => {
    //! Arrange
    const error = Error('any error for test')
    pagesRepository.getCardsDataFromCardsPageUrl.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(useCase.execute('pageUrl')).rejects.toThrowError(error)
  })
})
