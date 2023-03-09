import { useState, useEffect } from "react";
import Head from 'next/head';

export default function ContactDetails({ character }) {
  const [episodes, setEpisodes] = useState([])
  const [urls, setUrls] = useState(character.episode)
  
  useEffect(() => {
    let initial = []
    for (let i=0; i<urls.length; i++) {
      fetch(urls[i])
        .then((res) => res.json())
        .then((data) => {
          initial.push(data);
          if (i === (urls.length - 1)) setEpisodes(initial);   
        })
    }
  }, [])

  return (
    <>
      <Head>
        <title>{character.name} - SleekFlow</title>
        <meta name="description" content={`View information about ${character.name}`} />
      </Head>

      <div style={{display: 'flex'}}>
        <img src={character.image} alt={character.name} width="100" height="100"/>
        <h1>{character.name}</h1>
      </div>
      <hr />
      <h3>Personal Info</h3>
      <ul>
        <li>Status: {character.status}</li>
        <li>Gender: {character.gender}</li>
        <li>Species: {character.species}</li>
        <li>Location: {character.location.name}</li>
        <li>Origin: {character.origin.name}</li>
      </ul>
      <h3>Episodes</h3>
      <table>
        <tr>
          <th>Name</th>
          <th>Air Date</th>
          <th>Episode</th>
        </tr>
        { episodes.length != 0 ? episodes.map(ep => (
          <tr>
            <td>{ ep.name }</td>
            <td>{ ep.air_date }</td>
            <td>{ ep.episode }</td>
          </tr>
        )) : 'no records'}
      </table>
    </>
  )
} 

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch('https://rickandmortyapi.com/api/character');
  const {info, results} = await res.json();

  const paths = results.map((character) => ({
    params: { id: character.id.toString() }
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`);
  const character = await res.json();

  return { props: { character } }
}

