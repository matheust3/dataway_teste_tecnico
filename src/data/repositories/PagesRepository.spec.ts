import { mock, MockProxy } from 'jest-mock-extended'
import type { CardData } from '../../domain/models/CardData'
import type { ICardsDatasource } from '../datasource/ICardsDatasource'
import { PagesRepository } from './PagesRepository'

interface SutTypes{
  repository: PagesRepository
  cardsDatasource: MockProxy<ICardsDatasource> & ICardsDatasource
}

const makeSut = (): SutTypes => {
  const cardsDatasource = mock<ICardsDatasource>()

  const repository = new PagesRepository(cardsDatasource)

  return { cardsDatasource, repository }
}

describe('PagesRepository.spec.ts - getCardsDataFromCardsPageUrl', () => {
  let repository: PagesRepository
  let cardsDatasource: MockProxy<ICardsDatasource> & ICardsDatasource
  let cardsData: CardData[]

  beforeEach(() => {
    const sut = makeSut()

    repository = sut.repository
    cardsDatasource = sut.cardsDatasource

    cardsData = [
      { date: new Date(), ementa: 'ementa0', moreInfoUrl: 'moreInfoUrl0', title: 'title0' },
      { date: new Date(), ementa: 'ementa1', moreInfoUrl: 'moreInfoUrl1', title: 'title1' }
    ]
    cardsDatasource.getCardsFromUrl.mockResolvedValue(cardsData)
  })

  test('ensure call datasource with correct params', async () => {
    //! Arrange
    //! Act
    await repository.getCardsDataFromCardsPageUrl('pageUrl')
    //! Assert
    expect(cardsDatasource.getCardsFromUrl).toHaveBeenCalledWith('pageUrl')
  })

  test('ensure return datasource response', async () => {
    //! Arrange
    //! Act
    const result = await repository.getCardsDataFromCardsPageUrl('pageUrl')
    //! Assert
    expect(result).toBe(cardsData)
  })

  test('ensure throws if datasource throws', async () => {
    //! Arrange
    const error = Error('any error for test')
    cardsDatasource.getCardsFromUrl.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(repository.getCardsDataFromCardsPageUrl('pageUrl')).rejects.toThrowError(error)
  })
})
