const baseUrl = 'https://rickandmortyapi.com/api';

export async function fetchData(url) {
  const res = await fetch(`${baseUrl}/${url}`);
  const {info, results} = await res.json();

  return results;
}

export async function fetchSingleData(url,id) {
  const res = await fetch(`${baseUrl}/${url}/${id}`)
  const data = await res.json()

  return data;
}