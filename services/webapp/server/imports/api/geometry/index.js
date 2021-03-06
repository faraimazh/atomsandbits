// import { getCalculation } from '/server/imports/db/calculations/read';

import { Node } from '../interfaces';
import { Filter, PaginationInput } from '../inputs';
import { typeDefs as Calculation } from '../calculation';
import { typeDefs as PageInfo } from '../page-info';

import Query from './query';
import _resolvers from './resolvers';
import _typeDefs from './type-defs';

export const typeDefs = () => [
  _typeDefs,
  Node,
  Filter,
  PaginationInput,
  PageInfo,
  Calculation,
];

export const resolvers = {
  Query: Query,
  ..._resolvers,
};
