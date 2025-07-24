// src/types/utils.ts

export type FormFriendly<T> = {
  [K in keyof T]: T[K] extends string[]
    ? string
    : T[K] extends Date
    ? string
    : T[K] extends object
    ? FormFriendly<T[K]>
    : T[K]
}

// NEW: Make all properties non-optional, recursively
export type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>
}
