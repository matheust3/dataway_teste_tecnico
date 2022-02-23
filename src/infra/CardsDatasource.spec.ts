import { mock, MockProxy } from 'jest-mock-extended'
import type { Browser, ElementHandle, Page } from 'puppeteer'
import type { CardData } from '../domain/models/CardData'
import { CardsDatasource } from './CardsDatasource'

describe('CardsDatasource.spec.ts - getCardsFromUrl', () => {
  let datasource: CardsDatasource
  let browser: MockProxy<Browser> & Browser
  let page: MockProxy<Page> & Page
  let cardData: CardData
  let elementHandle: MockProxy<ElementHandle> & ElementHandle
  let titleElement: MockProxy<ElementHandle> & ElementHandle
  let dateElement: MockProxy<ElementHandle> & ElementHandle
  let ementaElement: MockProxy<ElementHandle> & ElementHandle
  let moreButtonElement: MockProxy<ElementHandle> & ElementHandle

  beforeEach(() => {
    browser = mock<Browser>()
    page = mock<Page>()

    datasource = new CardsDatasource(browser)

    browser.newPage.mockResolvedValue(page)

    elementHandle = mock<ElementHandle>()

    titleElement = mock<ElementHandle>() // Titulo do card
    dateElement = mock<ElementHandle>() // Data do card
    ementaElement = mock<ElementHandle>() // Ementa do card
    moreButtonElement = mock<ElementHandle>() // Botão de ver mais do card

    cardData = { date: new Date('2022-02-23'), ementa: 'ementa', moreInfoUrl: 'http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=20&inEspecie=7&nrProjeto=251&aaProjeto=2021&dsVerbete=transporte', title: 'title' }

    titleElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve(cardData.title)) })
    dateElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve('de 23/02/2022')) })
    ementaElement.evaluate.mockImplementation(async (fn: any) => { fn({}); return await new Promise(resolve => resolve(' ementa   ')) })
    moreButtonElement.evaluate.mockImplementation(async (fn: any) => { fn({ getAttribute: jest.fn }); return await new Promise(resolve => resolve("WinProjetoTXT(20,7,251,2021,'transporte');return false;")) })

    elementHandle.$.mockResolvedValueOnce(titleElement)
      .mockResolvedValueOnce(dateElement)
      .mockResolvedValueOnce(ementaElement)
      .mockResolvedValueOnce(moreButtonElement)

    page.$$.mockResolvedValue([elementHandle])
    page.url.mockReturnValue('http://host/LegisladorWEB.ASP')
  })

  test('ensure create new page', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(browser.newPage).toHaveBeenCalledTimes(1)
  })

  test('ensure goto page url', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(page.goto).toHaveBeenCalledWith('pageUrl', { waitUntil: 'networkidle2' })
  })

  test('ensure get cards element by class', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(page.$$).toHaveBeenCalledWith('.card')
  })

  test('ensure get card title', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(elementHandle.$).toBeCalledWith('.card-title')
  })

  test('ensure get card date', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(elementHandle.$).toBeCalledWith('.card-subtitle.mb-2.text-muted')
  })

  test('ensure get card ementa', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(elementHandle.$).toBeCalledWith('.card-text')
  })

  test('ensure get card button element', async () => {
    //! Arrange
    //! Act
    await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(elementHandle.$).toBeCalledWith('.card-body > a')
  })

  test('ensure return cardsData', async () => {
    //! Arrange
    //! Act
    const result = await datasource.getCardsFromUrl('pageUrl')
    //! Assert
    expect(result).toEqual([cardData])
  })
})

describe('CardsDatasource.spec.ts - _buttonHrefParser', () => {
  let datasource: CardsDatasource
  let browser: MockProxy<Browser> & Browser
  let page: MockProxy<Page> & Page
  let elementHandle: MockProxy<ElementHandle> & ElementHandle
  let element: MockProxy<ElementHandle> & ElementHandle

  beforeEach(() => {
    browser = mock<Browser>()
    page = mock<Page>()

    elementHandle = mock<ElementHandle>()

    datasource = new CardsDatasource(browser)

    const titleElement = mock<ElementHandle>() // Titulo do card
    const dateElement = mock<ElementHandle>() // Data do card
    const ementaElement = mock<ElementHandle>() // Ementa do card

    element = mock<ElementHandle>()
    elementHandle.$.mockResolvedValueOnce(titleElement)
      .mockResolvedValueOnce(dateElement)
      .mockResolvedValueOnce(ementaElement)
      .mockResolvedValueOnce(element)

    titleElement.evaluate.mockResolvedValue('title')
    dateElement.evaluate.mockResolvedValue('de 23/02/2022')
    ementaElement.evaluate.mockResolvedValue(' ementa   ')

    browser.newPage.mockResolvedValue(page)
    page.$$.mockResolvedValue([elementHandle])
    page.url.mockReturnValue('http://host/LegisladorWEB.ASP')
  })

  test('ensure required params', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1')
  })

  test('ensure insert dsVerbete into param', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1,9);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1&dsVerbete=9')
  })

  test('ensure insert inObjetoAnexo into param', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1,-1,9);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1&dsVerbete=-1&inObjetoAnexo=9')
  })

  test('ensure insert inObjetoAnexo into param', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1,-1,-1,9);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1&dsVerbete=-1&inObjetoAnexo=-1&nrEmenda=9')
  })

  test('ensure insert nrSubemenda into param', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1,-1,-1,-1,9);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1&dsVerbete=-1&inObjetoAnexo=-1&nrEmenda=-1&nrSubemenda=9')
  })

  test('ensure insert map into param', async () => {
    //! Arrange
    element.evaluate.mockResolvedValue('WinProjetoTXT(-1,-1,-1,-1,-1,-1,-1,-1,true);return false;')
    elementHandle.$.mockResolvedValueOnce(element)
    //! Act
    const result = await datasource.getCardsFromUrl('')
    //! Assert
    expect(result[0].moreInfoUrl).toEqual('http://host/LegisladorWEB.ASP?WCI=ProjetoTexto&ID=-1&inEspecie=-1&nrProjeto=-1&aaProjeto=-1&dsVerbete=-1&inObjetoAnexo=-1&nrEmenda=-1&nrSubemenda=-1&mapa=1')
  })
})
