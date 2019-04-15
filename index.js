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

  type Style {
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
  }

  type Category {
    id: ID!
    name: String
    description: String
    styles:[Style]
  }

  type Query {
    categories: [Category]
    category(id: ID!):Category
    style(id: ID!): Style
  }
  
`;

const resolvers = {
  Query: {
    categories: async () =>{
      const res = await Categories.find().populate('styles');
      return res;
    },
    style: async (_,args) =>{
      const res = await Styles.findOne({_id: args.id});           
      return res;
    },
    category: async (_,args) => {
      const res = await Categories.findOne({_id: args.id}).populate('styles');
      return res;
    }
  }  
};

const runServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  const res = await server.listen({ port: process.env.PORT || 4000, cors: {
    origin: true,
    credentials: true,
  }});
  console.log(`Server ready at ${res.url}`);
};

runServer();
