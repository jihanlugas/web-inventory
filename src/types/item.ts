export type ItemDetail = {
  createBy: number
  createDt: string
  isActive: boolean
  itemDescription: string
  itemId: number
  itemName: string
  photoUrl: string
  propertyId: number
  updateBy: number
  updateDt: string
}

export type ItemPage = {
  itemId: number
  itemName: string
  itemDescription: string
  isActive: boolean
  photoUrl: string
}

export type ItemCreate = {
  itemName: string
  itemDescription: string
  isActive: boolean
  photo?: File
}

export type ItemEdit = {
  itemName: string
  itemDescription: string
  isActive: boolean
  photoUrl: string
  photo?: File
}
