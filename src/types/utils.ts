// src/types/utils.ts

export type FormFriendly<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Array<infer U>
    ? Array<FormFriendly<U>>
    : T[K] extends object
    ? FormFriendly<T[K]>
    : T[K]
}

// Make all properties non-optional, recursively
export type DeepRequired<T> = {
  [K in keyof T]-?: NonNullable<T[K]> extends object
    ? DeepRequired<NonNullable<T[K]>>
    : NonNullable<T[K]>
}
