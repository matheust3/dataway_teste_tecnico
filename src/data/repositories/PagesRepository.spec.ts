import { mock, MockProxy } from 'jest-mock-extended'
import type { CardData } from '../../domain/models/CardData'
import type { DraftLaw } from '../../domain/models/DraftLaw'
import type { ICardsDatasource } from '../datasource/ICardsDatasource'
import type { IDraftLawDatasource } from '../datasource/IDraftLawDatasource'
import { PagesRepository } from './PagesRepository'

interface SutTypes{
  repository: PagesRepository
  cardsDatasource: MockProxy<ICardsDatasource> & ICardsDatasource
  draftLawDatasource: MockProxy<IDraftLawDatasource> & IDraftLawDatasource
}

const makeSut = (): SutTypes => {
  const cardsDatasource = mock<ICardsDatasource>()
  const draftLawDatasource = mock<IDraftLawDatasource>()

  const repository = new PagesRepository(cardsDatasource, draftLawDatasource)

  return { cardsDatasource, repository, draftLawDatasource }
}

describe('PagesRepository.spec.ts - persistDraftLawData', () => {
  let repository: PagesRepository
  let draftLawDatasource: MockProxy<IDraftLawDatasource> & IDraftLawDatasource
  let draftLawData: DraftLaw

  beforeEach(() => {
    const sut = makeSut()

    repository = sut.repository
    draftLawDatasource = sut.draftLawDatasource

    draftLawData = { author: 'author', date: new Date(), ementa: 'ementa', status: 'status', subject: 'subject', title: 'title', url: 'url' }
  })

  test('ensure call datasource with correct params', async () => {
    //! Arrange
    //! Act
    await repository.persistDraftLawData(draftLawData)
    //! Assert
    expect(draftLawDatasource.persist).toHaveBeenCalledWith(draftLawData)
  })

  test('ensure throws if datasource throws', async () => {
    //! Arrange
    const error = Error('any error for test')
    draftLawDatasource.persist.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(repository.persistDraftLawData(draftLawData)).rejects.toThrowError(error)
  })
})

describe('PagesRepository.spec.ts - getDraftLawDataFromCard', () => {
  let repository: PagesRepository
  let draftLawDatasource: MockProxy<IDraftLawDatasource> & IDraftLawDatasource
  let card: CardData
  let draftLawData: DraftLaw

  beforeEach(() => {
    const sut = makeSut()

    repository = sut.repository
    draftLawDatasource = sut.draftLawDatasource

    draftLawData = { author: 'author', date: new Date(), ementa: 'ementa', status: 'status', subject: 'subject', title: 'title', url: 'url' }
    card = { date: new Date(), ementa: 'ementa', moreInfoUrl: 'moreInfoUrl', title: 'title' }

    draftLawDatasource.getDraftLawDataFromCard.mockResolvedValue(draftLawData)
  })

  test('ensure call datasource with correct params', async () => {
    //! Arrange
    //! Act
    await repository.getDraftLawDataFromCard(card)
    //! Assert
    expect(draftLawDatasource.getDraftLawDataFromCard).toHaveBeenCalledWith(card)
  })

  test('ensure return datasource response', async () => {
    //! Arrange
    //! Act
    const result = await repository.getDraftLawDataFromCard(card)
    //! Assert
    expect(result).toBe(draftLawData)
  })

  test('ensure throws if datasource throws', async () => {
    //! Arrange
    const error = Error('any error for test')
    draftLawDatasource.getDraftLawDataFromCard.mockRejectedValue(error)
    //! Act
    //! Assert
    await expect(repository.getDraftLawDataFromCard(card)).rejects.toThrowError(error)
  })
})

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
