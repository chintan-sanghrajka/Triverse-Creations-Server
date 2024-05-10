import { mergeResolvers } from "@graphql-tools/merge";

import userResolver from "./user-resolver";
import categoriesResolver from "./categories-resolver";
import subCategoriesResolver from "./sub-categories-resolver";

const mergedResolvers = mergeResolvers([
  userResolver,
  categoriesResolver,
  subCategoriesResolver,
]);

export default mergedResolvers;
