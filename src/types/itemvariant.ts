export type ItemvariantDetail = {
  createBy: number
  createDt: string
  isActive: boolean
  itemvariantDescription: string
  itemvariantId: number
  itemvariantName: string
  photoUrl: string
  itemId: number
  updateBy: number
  updateDt: string
  price: number
}

export type ItemvariantPage = {
  itemvariantId: number
  itemvariantName: string
  itemvariantDescription: string
  price: number
  isActive: boolean
  photoUrl: string
}

export type ItemvariantCreate = {
  itemvariantId: number
  itemId: number
  itemvariantName: string
  itemvariantDescription: string
  price: number
  isActive: boolean
  photo?: File
}

export type ItemvariantEdit = {
  itemvariantName: string
  itemvariantDescription: string
  price: number
  isActive: boolean
  photoUrl: string
  photo?: File
}

