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

  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if(responseBody.errors){
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;

}

export async function createJob(input){
  const mutation = `mutation CreateJob($input: createJobInput){
    job: createJob(input: $input) {
      id
      title
    }
  }
  `;
  const {job} = await graphQlRequest(mutation,{input});
  return job;
}

export async function loadCompany(id){
  const quesy = `query CompanyQuery($id: ID!){
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
  const data = await graphQlRequest(query);
  return data.company;
}

export async function loadJobs(){
  const query = `{
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
    const data = await graphQlRequest(query);
    return data.jobs;

}

export async function loadJob(id){
  const query = `query JobQuery($id: ID!) {
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
  const data = await graphQlRequest(query, {id});
  return data.job;
}