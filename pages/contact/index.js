import { useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Contact({ characters }) {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [matchedCharacters, setMatchedCharacters] = useState(characters);

  const handleInputChange = e => {
    let text = e.target.value;
    setInputText(text);
    let unique = findMatch(characters, e.target.value);
    setMatchedCharacters(unique);
  }

  const findMatch = (arr, key) => {
    let matcher = new RegExp(`${key}`, 'gi');
    let filteredArr = arr.filter(obj => {
      let word = obj.name.toLowerCase();
      return word.match(matcher)
    })
    return filteredArr;
  }

  function constructTableRow(arr) {
    return (
      arr.map((character) => (
        // <Link href={`/contact/${character.id}`}>
          <tr key={character.id} onClick={() => router.push(`/contact/${character.id}`)}>
          {/* <tr key={character.id}> */}
            <td>{character.name}</td>
            <td>{character.status}</td>
            <td>{character.species}</td>
            <td>{character.gender}</td>
          </tr>
        // </Link>
      ))
    )
  }

  return (
    <>
      <Head>
        <title>Contact List - SleekFlow</title>
        <meta name="description" content="View our list of contacts with their related information" />
      </Head>

      <h1>Contacts</h1>
      <input type="text" placeholder={inputText ? inputText : "Search"} onChange={text => handleInputChange(text)}/>
      <table>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Species</th>
          <th>Gender</th>
        </tr>
        { 
          !inputText ? constructTableRow(characters) :
          matchedCharacters.length === 0 ? constructTableRow(characters) : constructTableRow(matchedCharacters)
        }

      </table>
    </>
  )
}

// This function gets called at build time
export async function getStaticProps() {
  const res = await fetch('https://rickandmortyapi.com/api/character');
  const {info, results} = await res.json();
  
  // By returning { props: { characters } }, the Contact component
  // will receive `characters` as a prop at build time
  return {
    props: { characters: results },
  }
  
}