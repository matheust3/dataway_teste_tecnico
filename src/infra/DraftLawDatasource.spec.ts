import { mock, MockProxy } from 'jest-mock-extended'
import type { Browser, ElementHandle, Page } from 'puppeteer'
import type { IDraftLawDatasource } from '../data/datasource/IDraftLawDatasource'
import type { CardData } from '../domain/models/CardData'
import type { DraftLaw } from '../domain/models/DraftLaw'
import { DraftLawDatasource } from './DraftLawDatasource'

interface SutTypes{
  datasource: IDraftLawDatasource
  browser: MockProxy<Browser> & Browser
}

const makeSut = (): SutTypes => {
  const browser = mock<Browser>()

  const datasource = new DraftLawDatasource(browser)

  return { browser, datasource }
}

describe('DraftLawDatasource.spec.ts - getDraftLawDataFromCard', () => {
  let datasource: IDraftLawDatasource
  let browser: MockProxy<Browser> & Browser
  let cardData: CardData
  let page: MockProxy<Page> & Page
  let titleElement: MockProxy<ElementHandle> & ElementHandle
  let statusElement: MockProxy<ElementHandle> & ElementHandle
  let subjectElement: MockProxy<ElementHandle> & ElementHandle
  let authorElement: MockProxy<ElementHandle> & ElementHandle
  let ementaElement: MockProxy<ElementHandle> & ElementHandle

  beforeEach(() => {
    const sut = makeSut()

    datasource = sut.datasource
    browser = sut.browser

    page = mock<Page>()
    browser.newPage.mockResolvedValue(page)

    titleElement = mock<ElementHandle>()
    titleElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve(cardData.title)) })

    statusElement = mock<ElementHandle>()
    statusElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve('status')) })

    subjectElement = mock<ElementHandle>()
    subjectElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve('subject')) })

    authorElement = mock<ElementHandle>()
    authorElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve('vereador\nAUTHOR AUTHOR')) })

    ementaElement = mock<ElementHandle>()
    ementaElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve(cardData.ementa)) })

    page.$
      .mockResolvedValueOnce(titleElement)
      .mockResolvedValueOnce(statusElement)
      .mockResolvedValueOnce(subjectElement)
      .mockResolvedValueOnce(authorElement)
      .mockResolvedValueOnce(ementaElement)

    cardData = { date: new Date(), ementa: 'ementa', moreInfoUrl: 'moreInfoUrl', title: 'title' }
  })

  test('ensure create a new page', async () => {
  //! Arrange
  //! Act
    await datasource.getDraftLawDataFromCard(cardData)
    //! Assert
    expect(browser.newPage).toHaveBeenCalledTimes(1)
  })

  test('ensure goto more info page', async () => {
    //! Arrange
    //! Act
    await datasource.getDraftLawDataFromCard(cardData)
    //! Assert
    expect(page.goto).toHaveBeenCalledWith(cardData.moreInfoUrl, { waitUntil: 'networkidle2' })
  })

  test('ensure get data html elements correctly', async () => {
    //! Arrange
    //! Act
    await datasource.getDraftLawDataFromCard(cardData)
    //! Assert
    expect(page.$.mock.calls).toEqual([
      ['.card-title'],
      ['body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(2)'],
      ['body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(8)'],
      ['body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(10)'],
      ['body > section.container > div > div:nth-child(5) > p']
    ])
  })

  test('ensure throws if paga is invalid', async () => {
    //! Arrange
    page.$.mockReset()
      .mockResolvedValueOnce(titleElement)
      .mockResolvedValueOnce(statusElement)
      .mockResolvedValueOnce(subjectElement)
      .mockResolvedValueOnce(authorElement)
      .mockResolvedValueOnce(null)
    const error = Error('invalid law draw page')
    //! Act
    //! Assert
    await expect(datasource.getDraftLawDataFromCard(cardData)).rejects.toThrowError(error)
  })

  test('ensure return draft law', async () => {
    //! Arrange
    const draftLaw: DraftLaw = { author: 'vereador AUTHOR AUTHOR', date: cardData.date, ementa: cardData.ementa, status: 'status', subject: 'subject', title: 'title', url: cardData.moreInfoUrl }
    //! Act
    const result = await datasource.getDraftLawDataFromCard(cardData)
    //! Assert
    expect(result).toEqual(draftLaw)
  })
})
