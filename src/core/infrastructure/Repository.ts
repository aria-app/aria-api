export interface Repository<TEntity> {
  exists(entity: TEntity): Promise<boolean>;
  delete(entity: TEntity): Promise<TEntity>;
  save(entity: TEntity): Promise<TEntity>;
}
