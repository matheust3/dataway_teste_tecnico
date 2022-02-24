import type { PrismaClient } from '@prisma/client'
import type { Browser } from 'puppeteer'
import type { IDraftLawDatasource } from '../data/datasource/IDraftLawDatasource'
import type { CardData } from '../domain/models/CardData'
import type { DraftLaw } from '../domain/models/DraftLaw'

export class DraftLawDatasource implements IDraftLawDatasource {
  constructor (
    private readonly _browser: Browser,
    private readonly _prismaClient: PrismaClient
  ) {}

  async getDraftLawDataFromCard (card: CardData): Promise<DraftLaw> {
    const page = await this._browser.newPage()
    await page.goto(card.moreInfoUrl, { waitUntil: 'networkidle2' })
    let title: string | undefined
    let status: string | undefined
    let subject: string | undefined
    let author: string | undefined
    let ementa: string | undefined

    const titleElement = await page.$('.card-title')
    if (titleElement !== null) {
      title = (await titleElement.evaluate(el => el.textContent)).trim()
    }
    const statusElement = await page.$('body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(2)')
    if (statusElement !== null) {
      status = (await statusElement.evaluate(el => el.textContent)).trim()
    }
    const subjectElement = await page.$('body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(8)')
    if (subjectElement !== null) {
      subject = (await subjectElement.evaluate(el => el.textContent)).trim()
    }
    const authorElement = await page.$('body > section.container > div > div:nth-child(2) > div > div.col-lg > dl > dd:nth-child(10)')
    if (authorElement !== null) {
      author = (await authorElement.evaluate(el => el.innerText)).trim()
      author = author?.replace(/\n/g, ' ').replace(/\.$/g, '')
    }
    const ementaElement = await page.$('body > section.container > div > div:nth-child(5) > p')
    if (ementaElement !== null) {
      ementa = (await ementaElement.evaluate(el => el.textContent)).trim()
    }
    if (author !== undefined &&
      ementa !== undefined &&
      status !== undefined &&
      subject !== undefined &&
      title !== undefined
    ) {
      return { author: author, date: card.date, ementa: ementa, status: status, subject: subject, title: title, url: card.moreInfoUrl }
    } else {
      throw Error('invalid law draw page')
    }
  }

  async persist (draftLaw: DraftLaw): Promise<void> {
    await this._prismaClient.projetosLei.upsert({
      create: {
        assunto: draftLaw.subject,
        autor: draftLaw.author,
        ementa: draftLaw.ementa,
        id: draftLaw.title,
        situacao: draftLaw.status,
        titulo: draftLaw.title
      },
      update: {
        assunto: draftLaw.subject,
        autor: draftLaw.author,
        ementa: draftLaw.ementa,
        situacao: draftLaw.status,
        titulo: draftLaw.title
      },
      where: {
        id: draftLaw.title
      }
    })
  }
}
