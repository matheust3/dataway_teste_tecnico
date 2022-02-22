import type { IExtractDataFromPageCardsUseCase } from '../../domain/use-cases/IExtractDataFromPageCardsUseCase'

export class ExtractDataController {
  constructor (private readonly _extractDataFromPageCardsUseCase: IExtractDataFromPageCardsUseCase) {}

  /**
     * Extrai os dados de uma pagina de cartões
     * @param cardsPageUrl Url da pagina de cartões
     * @returns Return true se a operação foi bem sucedida, se nao false
     */
  async handle (cardsPageUrl: string): Promise<void> {
    console.log(`Extraindo dados de: ${cardsPageUrl}`)
    try {
      if (await this._extractDataFromPageCardsUseCase.execute(cardsPageUrl)) {
        console.log('Dados extraídos com sucesso!')
      } else {
        console.log('Falha ao extrair os dados!')
      }
    } catch (e) {
      console.error('Erro ao extrair os dados!', e)
    }
  }
}
