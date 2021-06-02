import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {getAccessToken, isLoggedIn } from './auth';
const endpointUrl = 'http:localhost:9000/graphql';

async function graphQlRequest(query, variables = {}){
  const request = {
    method : 'POST',
    header : {'content-type' : 'application/json'},
    body : JSON.stringify({query, variables})
  };
  if (isLoggedIn()){
    request.headers['authorization'] = 'Bearer ' + getAccessToken();    
  }

  const client = new ApolloClient({
    link : new HttpLink({ uri : endpointUrl}),
    cache : new InMemoryCache()
  });

  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if(responseBody.errors){
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;

}

export async function createJob(input){
  const mutation = gql`mutation CreateJob($input: createJobInput){
    job: createJob(input: $input) {
      id
      title
    }
  }
  `;
  const {data : {job} } = await client.mutate({query, variables : {input}});
  return job;
}

export async function loadCompany(id){
  const quesy = gql`query CompanyQuery($id: ID!){
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    } 
  }`
  const {data : {company} } = await client.query({query, variables : {id}})
  return company;
}

export async function loadJobs(){
  const query = gql`{
      jobs 
      {
        id 
        title
        company {
          id
          name
        }   
        }
      }
    `;
    const {data : {jobs} } = await client.query({query})
    return jobs;

}

export async function loadJob(id){
  const query = gql`query JobQuery($id: ID!) {
    jobs(id: $id) 
    {
      id 
      title
      company {
        id
        name
      }
      description   
      }
  }`;
  const {data : {job} } = await client.query({query, variables : {id}});
  return job;
}