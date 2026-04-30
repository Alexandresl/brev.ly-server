export class ShortUrlAlreadyExists extends Error {
  constructor() {
    super('Essa URL encontada já existe.')
  }
}
