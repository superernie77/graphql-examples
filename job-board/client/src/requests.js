const endpointUrl = 'http:localhost:9000/graphql';

async function graphQlRequest(query, variables = {}){
  const response = await fetch(endpointURL, {
      method : 'POST',
      header : {'content-type' : 'application/json'},
      body : JSON.stringify({query, variables})});
  const responseBody = await response.json();
  if(responseBody.errors){
    const message = responseBody.errors.map((error) => error.message).join('\n');
    throw new Error(message);
  }
  return responseBody.data;

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
  const query = `query JobQuery($id : ID!) {
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