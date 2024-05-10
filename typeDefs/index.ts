import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user-typeDef";
import categoriesTypeDef from "./categories-typeDef";
import subCategoriesTypeDef from "./sub-categories-typeDef";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  categoriesTypeDef,
  subCategoriesTypeDef,
]);

export default mergedTypeDefs;
