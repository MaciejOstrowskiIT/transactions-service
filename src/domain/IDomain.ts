export interface IDomain<T> {
    getId:() => string
    mapToJson:() => T
}