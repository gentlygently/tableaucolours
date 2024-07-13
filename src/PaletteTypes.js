class PaletteType {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
export class PaletteTypes {
  static #types = {}

  static #add(id, name) {
    const type = new PaletteType(id, name)
    PaletteTypes.#types[id] = type
    return type
  }

  static regular = PaletteTypes.#add('regular', 'Regular')
  static sequential = PaletteTypes.#add('ordered-sequential', 'Sequential')
  static diverging = PaletteTypes.#add('ordered-diverging', 'Diverging')

  static get(id) {
    return PaletteTypes.#types[id]
  }
}
