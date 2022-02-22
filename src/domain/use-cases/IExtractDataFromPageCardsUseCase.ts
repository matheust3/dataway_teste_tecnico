export interface IExtractDataFromPageCardsUseCase{
  /**
     * Extrai os dados de uma pagina de cartões
     * @param cardsPageUrl Url da pagina de cartões
     * @returns Return true se a operação foi bem sucedida, se nao false
     */
  execute: (cardsPageUrl: string) => Promise<boolean>
}
