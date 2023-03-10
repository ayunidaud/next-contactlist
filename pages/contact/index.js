import { useRouter } from 'next/router';
import Head from 'next/head';

import * as React from 'react';
import { useState } from "react";

import { Grid, Typography, TextField, Paper, Container } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@mui/material';


export default function Contact({ characters }) {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [matchedCharacters, setMatchedCharacters] = useState(characters);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - episodes.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
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

  function constructTableData(data) {
    return (
      <>
        <TableBody>              
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <TableRow key={row.id} hover onClick={() => router.push(`/contact/${row.id}`)} style={{ cursor: 'pointer'}}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="justify">
                {row.status}
              </TableCell>
              <TableCell style={{ width: 160 }} align="justify">
                {row.species}
              </TableCell>
              <TableCell style={{ width: 160 }} align="justify">
                {row.gender}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[20]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </>
    )
  }


  return (
    <>
      <Head>
        <title>Contact List - SleekFlow</title>
        <meta name="description" content="View our list of contacts with their related information" />
      </Head>

      <Container disableGutters  sx={{ p:4 }}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Typography variant="h4">Contact</Typography>
          </Grid>

          <Grid item md={12}>
            <TextField id="input-search" placeholder={inputText ? inputText : "Search"} size='small' variant="outlined" onChange={text => handleInputChange(text)}/>
          </Grid>

          <Grid item md={12}>  
            <TableContainer component={Paper}>
              <Table  sx={{ minWidth: 500 }} aria-label="custom pagination table">

                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Species</TableCell>
                    <TableCell>Gender</TableCell>
                  </TableRow>
                </TableHead>
                { 
                  !inputText ? constructTableData(characters)  :
                  matchedCharacters.length === 0 ? constructTableData(characters)  : constructTableData(matchedCharacters)
                }
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>

    </>
  )
}

export async function getStaticProps() {
  const res = await fetch('https://rickandmortyapi.com/api/character');
  const {info, results} = await res.json();
  
  return {
    props: { characters: results },
  }
}