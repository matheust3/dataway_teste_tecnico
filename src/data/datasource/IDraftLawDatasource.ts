import type { CardData } from '../../domain/models/CardData'
import type { DraftLaw } from '../../domain/models/DraftLaw'

export interface IDraftLawDatasource{
  /**
     * Pega as informações de um projeto de lei
     * @param {(CardData)} card Cartão referente a lei
     * @returns Retorna {@link DraftLaw | DraftLaw}
     */
  getDraftLawDataFromCard: (card: CardData) => Promise<DraftLaw>
}
