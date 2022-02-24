import puppeteer from 'puppeteer'
import { PagesRepository } from '../../data/repositories/PagesRepository'
import { ExtractDataFromPageCardsUseCase } from '../../domain/use-cases/ExtractDataFromPageCardsUseCase'
import { CardsDatasource } from '../../infra/CardsDatasource'
import { DraftLawDatasource } from '../../infra/DraftLawDatasource'
import { ExtractDataController } from '../../presentation/controllers/ExtractDataController'
import prismaClient from '../singletons/prismaClient'

export class App {
  public async start (): Promise<void> {
    const browser = await puppeteer.launch({ headless: true })
    const cardsDatasource = new CardsDatasource(browser)
    const drawLawDatasource = new DraftLawDatasource(browser, prismaClient)
    const pagesRepository = new PagesRepository(cardsDatasource, drawLawDatasource)
    const useCase = new ExtractDataFromPageCardsUseCase(pagesRepository)
    const controller = new ExtractDataController(useCase)
    await controller.handle('https://www.legislador.com.br/LegisladorWEB.ASP?WCI=ProjetoTramite&ID=20&dsVerbete=transporte')
    await browser.close()
  }
}
