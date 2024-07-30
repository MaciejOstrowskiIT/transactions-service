export interface Jsonable<DomainSchema> {
    mapToJson(): DomainSchema
}

export interface Serializer <DbSchema, Entity> {
    mapToEntity(data: DbSchema): Entity;
    mapToDb(data: Entity): DbSchema;
}
