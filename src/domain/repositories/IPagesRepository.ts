import type { CardData } from '../models/CardData'
import type { DraftLaw } from '../models/DraftLaw'

export interface IPagesRepository{
  /**
     * Pega as informações dos cartões de uma pagina que contem cartões
     * @param {(string)} url Url da pagina que contem cartões
     * @return Retorna um Array de {@link CardData | CardData}
     */
  getCardsDataFromCardsPageUrl: (url: string) => Promise<CardData[]>

  /**
   * Pega as informações de um projeto de lei com base em um cartão
   * @param {(CardData)} card Cartão referente ao projeto de lei
   * @return Retorna as informações de um projeto de lei
   */
  getDraftLawDataFromCard: (card: CardData) => Promise<DraftLaw>

  /**
   * Salva as informações de um  projeto de lei no banco de dados
   * @param {(DraftLaw)} data Projeto de lei
   */
  persistDraftLawData: (data: DraftLaw) => Promise<void>
}
