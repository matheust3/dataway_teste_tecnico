import { ExtractDataController } from './ExtractDataController'
import { mock, type MockProxy } from 'jest-mock-extended'
import type { IExtractDataFromPageCardsUseCase } from '../../domain/use-cases/IExtractDataFromPageCardsUseCase'

describe('ExtractDataController.spec.ts - handle', () => {
  let controller: ExtractDataController
  let extractDataFromPageCardsUseCase: MockProxy<IExtractDataFromPageCardsUseCase> & IExtractDataFromPageCardsUseCase

  beforeEach(() => {
    extractDataFromPageCardsUseCase = mock<IExtractDataFromPageCardsUseCase>()

    controller = new ExtractDataController(extractDataFromPageCardsUseCase)

    extractDataFromPageCardsUseCase.execute.mockResolvedValue(true)
  })

  test('ensure call use case with correct param', async () => {
    //! Arrange
    //! Act
    await controller.handle('pageUrl')
    //! Assert
    expect(extractDataFromPageCardsUseCase.execute).toHaveBeenCalledWith('pageUrl')
  })

  test('ensure log success message if use case return true', async () => {
    //! Arrange
    const logMocked = jest.spyOn(global.console, 'log')
    //! Act
    await controller.handle('pageUrl')
    //! Assert
    expect(logMocked.mock.calls[1]).toEqual(['Dados extraídos com sucesso!'])
  })

  test('ensure show status log', async () => {
    //! Arrange
    const logMocked = jest.spyOn(global.console, 'log')
    //! Act
    await controller.handle('pageUrl')
    //! Assert
    expect(logMocked.mock.calls[0]).toEqual(['Extraindo dados de: pageUrl'])
  })

  test('ensure show failure message if use case return false', async () => {
    //! Arrange
    const logMocked = jest.spyOn(global.console, 'log')
    extractDataFromPageCardsUseCase.execute.mockResolvedValue(false)
    //! Act
    await controller.handle('pageUrl')
    //! Assert
    expect(logMocked.mock.calls[1]).toEqual(['Falha ao extrair os dados!'])
  })

  test('ensure catch errors if use case trows', async () => {
    //! Arrange
    const error = Error('any test error')
    extractDataFromPageCardsUseCase.execute.mockRejectedValue(error)
    const logMocked = jest.spyOn(global.console, 'error')
    //! Act
    await controller.handle('pageUrl')
    //! Assert
    expect(logMocked).toHaveBeenCalledWith('Erro ao extrair os dados!', error)
  })
})
