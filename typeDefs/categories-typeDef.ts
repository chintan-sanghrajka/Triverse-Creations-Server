const categoriesTypeDef = `#graphql

    scalar Date

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
        categories: FetchCategoryResponse
        category(categoryId: ID!): FetchCategoryResponse
        activeCategories: FetchCategoryResponse
    }

    type FetchCategoryResponse {
        message: String!,
        status: Int!,
        data: [Categories]
    }
`;

export default categoriesTypeDef;
