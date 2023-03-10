import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";

import * as React from 'react';
import { useState, useEffect } from "react";

import { Grid, Typography, Paper, Divider, Container, Stack  } from '@mui/material';
import { TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TablePagination } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';

const myLoader = ({ src, width, quality }) => {
  return `https://rickandmortyapi.com/api/character/avatar/${src}?w=${width}&q=${quality || 75}`
}

export default function ContactDetails({ character }) {
  const [episodes, setEpisodes] = useState([])
  const [urls, setUrls] = useState(character.episode)
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - episodes.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Head>
        <title>{`${character.name} - SleekFlow`}</title>
        <meta name="description" content={`View information about ${character.name}`} />
      </Head>

      <Link href='/contact'><Typography variant="subtitle1" align="center">See all contacts</Typography></Link>

      <Container disableGutters  sx={{ p:4 }}>
      
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Stack direction="row"  spacing={6}  justifyContent="flex-start"  alignItems="center">
              <Image
                loader={myLoader}
                src={character.image.substr(49)}
                alt="Picture of the author"
                width={275}
                height={275}
                style={{borderRadius: '50%'}}
              />
              <Typography variant="h2">{character.name}</Typography>
            </Stack>
          </Grid>

          <Grid item md={12}>
            <Divider sx={{ py: 2 }} />
          </Grid>

          <Grid item md={12}>
            <Typography variant="h4">Personal Info</Typography>
          </Grid>
          
          <Grid item md={12}>
            <Paper>
              <List>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText primary="Status" secondary={character.status} />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText primary="Gender" secondary={character.gender}  />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText primary="Species" secondary={character.species}  />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>              
                    <ListItem>
                      <ListItemText primary="Location" secondary={character.location.name}  />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>      
                    <ListItem>
                      <ListItemText primary="Origin" secondary={character.origin.name}  />
                    </ListItem>
                  </Grid>
              </Grid>
                </List>
            </Paper>
          </Grid>

          <Grid item md={12}>
            <Typography variant="h4">Episodes</Typography>
          </Grid>

          <Grid item md={12}>
            <TableContainer component={Paper}>
              <Table  sx={{ minWidth: 500 }} aria-label="custom pagination table">

                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Air Date</TableCell>
                    <TableCell>Episode</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>              
                  {(rowsPerPage > 0
                    ? episodes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : episodes
                  ).map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="justify">
                        {row.air_date}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align="justify">
                        {row.episode}
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
                      count={episodes.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>

        </Grid>
      </Container>
    </>
  )
} 

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

export async function getStaticProps({ params }) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${params.id}`);
  const character = await res.json();

  return { props: { character } }
}

