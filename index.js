const { ApolloServer, gql } = require("apollo-server");
const mongoose = require('mongoose');
require('./dbConnect');

const categoriesSchema = mongoose.Schema({
  name: String,
  description: String,
  styles: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Styles'}]
});

const Categories = mongoose.model('Categories', categoriesSchema);

const stylesSchema = mongoose.Schema({
  name: String,
  aroma: String,
  appearance: String,
  flavor: String,
  mouthfeel: String,
  impression: String,
  comments: String,
  history: String,
  ingredients: String,
  comparison: String,
  examples:[String],
  tags: [String],
  stats: {
          ibu: {
                  low: String,
                  high: String
          },
          og: {
                  low: String,
                  high: String
          },
          fg:{
                  low: String,
                  high: String
          },
          srm:{
                  low: String,
                  high: String
          },
          abv:{
                  low: String,
                  high: String
          },
  },
  category: {type: mongoose.SchemaTypes.ObjectId, ref: 'Categories'}
});

const Styles = mongoose.model('Styles', stylesSchema);

const typeDefs = gql`
  type Categories {
    id: ID
    name: String
    description: String
    styles:[Styles]
  }

  type statsField {
    ibu: statsFields!
    og: statsFields!
    fg: statsFields!
    srm: statsFields!
    abv: statsFields!
  }

  type statsFields {
    low: String!
    high: String!
  }

  type Styles {
    id: ID!
    name: String!
    aroma: String
    appearance: String!
    flavor: String!
    mouthfeel: String!
    impression: String!
    comments: String!
    history: String!
    ingredients: String!
    comparison: String!
    examples:[String]!
    tags: [String]!
    stats: statsField!  
    category:Categories!
  }

  type Query {
    categories: [Categories]
    styles:[Styles]
  }
  
`;

const resolvers = {
  Query: {
    categories: async () =>{
      const res = await Categories.find().populate('styles');
      return res;
    },
    styles: async () =>{
      const res = await Styles.find();           
      return res;
    }
  }  
};

const runServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const res = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`Server ready at ${res.url}`);
};

runServer();
