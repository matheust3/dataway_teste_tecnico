import type { CardData } from '../../domain/models/CardData'

export interface ICardsDatasource{
  /**
     * Pega as informações dos cartões de uma pagina
     * @param {(string)} url Url da pagina
     * @return Retorna um Array de {@link CardData | CardData}
     */
  getCardsFromUrl: (url: string) => Promise<CardData[]>
}
