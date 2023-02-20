/** @format */

import React, { useContext, useEffect, useState } from 'react';
import { Grid, Paper, Stack, Typography } from '@mui/material/';
import { styled } from '@mui/material/styles';
import Customers from '../components/Customers';
import Machines from '../components/Machines';
import { MachineContext } from '../context/MachineContext';
import axios from 'axios';
import OldImg from '../components/OldImg';
import NewImg from '../components/NewImg';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const DashboardPage = () => {
  const { machineID } = useContext(MachineContext);
  const [date, setDate] = useState();
  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .get(`../inspection.php?api=${machineID}`, { cancelToken: source.token })
      .then(res => {
        setDate(res.data.res);
      })
      .catch(err => console.log(err));
    return () => {
      source.cancel();
    };
  }, [machineID]);

  return (
    <Grid container spacing={0.5} sx={{ p: 1 }}>
      <Grid item xs={12} md={5} lg={2.5}>
        <Item>
          <Customers />
          <Machines />
        </Item>
      </Grid>
      <Grid item xs={12} md={7} lg={9.5}>
        {machineID ? (
          <>
            <Item>
              <Typography variant='h6' fontWeight='bold' color='black'>
                Inspection Date: {date}
              </Typography>
            </Item>
            <Item sx={{ mt: 0.5 }}>
              <Stack direction={{ xs: 'column', lg: 'row' }}>
                <OldImg date={date} />
                <NewImg date={date} />
              </Stack>
            </Item>
          </>
        ) : (
          <Item>
            <Typography
              sx={{
                paddingBlock: 2,
                color: 'rgba(0,0,0,0.8)',
                border: '2px solid black',
                borderRadius: 2,
              }}>
              No Machine is added for selected Customer
            </Typography>
          </Item>
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
