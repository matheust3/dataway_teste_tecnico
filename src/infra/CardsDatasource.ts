import type { ICardsDatasource } from '../data/datasource/ICardsDatasource'
import type { CardData } from '../domain/models/CardData'
import type { Browser } from 'puppeteer'

export class CardsDatasource implements ICardsDatasource {
  constructor (private readonly _browser: Browser) {}

  async getCardsFromUrl (url: string): Promise<CardData[]> {
    const page = await this._browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })
    const cards = await page.$$('.card')
    const cardsData: CardData[] = []
    for (const cardElement of cards) {
      const cardData: CardData = {} as any

      const titleElement = await cardElement.$('.card-title')
      const dateElement = await cardElement.$('.card-subtitle.mb-2.text-muted')
      const ementaElement = await cardElement.$('.card-text')
      const moreButtonElement = await cardElement.$('.card-body > a')

      if (moreButtonElement !== null) {
        const url = page.url()
        const drawLawUrl = url.substring(0, url.indexOf('/Legis') + 1) + this._buttonHrefParser(await moreButtonElement.evaluate(el => el.getAttribute('onclick')))
        cardData.moreInfoUrl = drawLawUrl
      }
      if (titleElement !== null) {
        cardData.title = await titleElement.evaluate(el => el.textContent)
      }
      if (dateElement !== null) {
        let dateStr: string = await dateElement.evaluate(el => el.textContent)
        dateStr = dateStr.replace('de', '').trim()
        const dateArray = dateStr.split('/')
        cardData.date = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`)
      }
      if (ementaElement !== null) {
        cardData.ementa = (await ementaElement.evaluate(el => el.textContent)).trim()
      }
      if (cardData.date !== undefined && cardData.ementa !== undefined && cardData.moreInfoUrl !== undefined && cardData.title !== undefined) {
        cardsData.push(cardData)
      }
    }
    await page.close()
    return cardsData
  }

  private _buttonHrefParser (data: string): string {
    const [argID, argINEspecie, argNRProjeto, argAAProjeto, argVerbete, argINObjetoAnexo, argNREmenda, argNRSubemenda, argMapa] = data.substring(data.indexOf('TXT(') + 4, data.indexOf(');return')).replace(/'/g, '').split(',')
    let param = ''
    if (argVerbete !== undefined) { param = '&dsVerbete=' + argVerbete };
    if (argINObjetoAnexo !== undefined) { param += '&inObjetoAnexo=' + argINObjetoAnexo };
    if (argNREmenda !== undefined) { param += '&nrEmenda=' + argNREmenda };
    if (argNRSubemenda !== undefined) { param += '&nrSubemenda=' + argNRSubemenda };
    if (argMapa !== undefined) { param += '&mapa=1' };
    return 'LegisladorWEB.ASP?WCI=ProjetoTexto&ID=' + argID + '&inEspecie=' + argINEspecie + '&nrProjeto=' + argNRProjeto + '&aaProjeto=' + argAAProjeto + param
  }
}
