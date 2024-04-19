const gql = require('graphql-tag');
const { print } = require('graphql/language/printer');
const getClient = require('./client');

const QUERY = gql`
  query getUserByEmail($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      firebaseId
      email
    }
  }
`;

const getUserByEmail = (variables) => {
  return getClient().request(print(QUERY), variables);
};

module.exports = getUserByEmail;
