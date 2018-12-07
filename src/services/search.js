
export function search({query}) {
  const results = createSearchResults();
  return results;
}

export function createSearchResults(max=generateRandomNumber(1, 200)){
  const results = [];
  for(let i = 0; i < max; ++i){
    results.push(createSearchResult());
  }
  return results;
}

function createSearchResult({userId=generateRandomNumber(1, 99999), idmGuid=generateRandomString('guid'), username=generateRandomString('username'),
                            firstName=generateRandomString('first'), lastName=generateRandomString('last'), orgId=generateRandomNumber(1, 99999),
                            orgName=generateRandomString('org'), pod=generateRandomString('pod')}={}){

  return {
    user:{
      id: userId,
      idmGuid,
      username,
      firstName,
      lastName
    },
    org:{
      orgId,
      orgName,
      pod
    }
  };
}

function generateRandomNumber(min, max){
  return Math.floor(Math.random() * (+max - +min)) + +min;
}

function generateRandomString(base=''){
  return `${base}-${generateRandomNumber(1, 99999)}`;
}
