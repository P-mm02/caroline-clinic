export type AboutLangField = {
  en: string
  th: string
  jp: string
  zh: string
}

export type AboutType = {
  _id: string
  aboutDescription1: AboutLangField
  aboutDescription2: AboutLangField
  aboutImage: string[]
}
