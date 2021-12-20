const express = require('express');
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');

const app = express();

app.use(cors());

const getTournamentId = async () => {
  const URL =
    'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17';
  const response = await axios.get(URL);

  return response.data;
};

const getTournamentData = async () => {
  const URL =
    'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17';

  const response = await axios.get(URL);

  return response.data;
};

const getMatchesData = async (id) => {
  const URL = `https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/${id}/2021`;

  const response = await axios.get(URL);
  return response.data;
};

const toDate = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('/');
  const [hs, mn] = timeStr.split(':');
  return new Date(`20${year}/${month}/${day} ${hs}:${mn}`);
};

app.get('/', (req, res) => {
  res.send('Server working properly');
});

app.get('/tournamentid', async (req, res) => {
  const response = await getTournamentId();
  const tournamentid = response.doc[0].data.tournaments;

  console.log(tournamentid);
  tournamentid.forEach((obj) => {
    const tournamentObj = obj._id;
    console.log(tournamentObj);
  });

  res.send(tournamentid);
});

app.get('/tournaments', async (req, res) => {
  const tournaments = await getTournamentData();
  res.send(tournaments);
});

app.get('/matches', async (req, res) => {
  const response = await getMatchesData(29);

  const { matches } = response.doc[0].data;

  // convert object to array
  const matchesArray = _.values(matches);

  // for each match added a sort field
  matchesArray.forEach((obj) => {
    const { time, date } = obj.time;
    const sort = toDate(date, time);
    console.log(sort);
    obj.sort = sort;
  });

  ordered = _.orderBy(matchesArray, ['sort'], ['desc']);

  res.send(ordered.slice(0, 5));
});

const port = 4000;
app.listen(port, () => {
  console.log(`server running on port .... ${port}`);
});
