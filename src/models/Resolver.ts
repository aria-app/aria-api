import ApiContext from './ApiContext';

export type Resolver<
  TResponse,
  TVariables = Record<string, never>,
  TParent = Record<string, never>
> = (
  parent: TParent,
  variables: TVariables,
  context: ApiContext,
) => Promise<TResponse>;
