export async function search({q}){
  const result = await f({path: `/v1/search?q=${q}`});
  return result;
}

export async function f({method='GET', bodyObj, baseUrl='http://127.0.0.1:3000', path='', keepalive=true}){
  const bodyObjString = JSON.stringify(bodyObj, null, 2);
  const req = new Request(`${baseUrl}${path}`, {method, body: bodyObjString, keepalive});
  const res = await fetch(req);
  const result = await res.json();
  return result;
}
