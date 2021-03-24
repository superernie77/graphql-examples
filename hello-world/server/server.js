const { gql } = require('apollo-server');

const typedefs = gql`
    type Query {
        greeting : String
    }
`;
