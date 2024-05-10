const userTypeDef = `#graphql
    type User {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        contact: String!
        country_code: String!
        active: Boolean!
        banned: Boolean!
    }

    type Query {
        users: FetchUserResponse
        user(userId: ID!): FetchUserResponse
    }

    type FetchUserResponse {
        message: String!,
        status: Int!,
        data: [User]
    }
`;

export default userTypeDef;
