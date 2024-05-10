const subCategoriesTypeDef = `#graphql

    type SubCategoriesWithCat {
        id: ID!
        name: String!
        description: String!
        image: String!
        status: Boolean!
        short_code: String!
        remarks: String!
        category_id: ID!
        created_at: String
        updated_at: String
        created_by: ID
        updated_by: ID
        category: [Categories!]!
    }

    type SubCategories {
        id: ID!
        name: String!
        description: String!
        image: String!
        status: Boolean!
        short_code: String!
        remarks: String!
        category_id: ID!
        created_at: String
        updated_at: String
        created_by: ID
        updated_by: ID
    }

    type Categories {
        id: ID!
        name: String!
        description: String!
        image: String!
        status: Boolean!
        short_code: String!
        remarks: String!
        created_at: String
        updated_at: String
        created_by: ID
        updated_by: ID
    }

    type Query {
        subCategories: FetchSubCategoryWithCatResponse
        subCategory(subCategoryId: ID!): FetchSubCategoryResponse
        activeSubCategories: FetchSubCategoryResponse
    }

    type FetchSubCategoryWithCatResponse {
        message: String!,
        status: Int!,
        data: [SubCategoriesWithCat]!
    }

    type FetchSubCategoryResponse {
        message: String!,
        status: Int!,
        data: [SubCategories]!
    }
`;

export default subCategoriesTypeDef;
