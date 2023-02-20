/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Stack, TableRow, Alert } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { ClientContext } from '../context/ClientContext';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontSize: '1.7vh',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '1.7vh',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:nth-child(n) td': {
    paddingInline: 1,
  },
}));
const MyTableRow = ({ lable, name }) => {
  const { clientID } = useContext(ClientContext);
  const [status, setStatus] = useState(0);
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const getStatus = async () => {
    await axios
      .get(`../company/fileInput.php?id=${clientID}&status=${name}Status`, {
        cancelToken: source.token,
      })
      .then(res => {
        setStatus(+res.data.res);
      })
      .catch(err => console.log(err.message));
  };
  useEffect(() => {
    getStatus();
    return () => {
      source.cancel();
    };
  }, [clientID]);
  useEffect(() => {
    const inv = setInterval(() => {
      if (status === 0) {
        getStatus();
      } else {
        clearInterval(inv);
      }
    }, 1000);
    return () => clearInterval(inv);
  }, []);
  const handleAction = async e => {
    await axios
      .get(`action.php?id=${clientID}&action=${e.target.value}&name=${name}`)
      .then(res => {
        console.log(res.data);
        saveAs(res.data);
        // const url = `${axios.defaults.baseURL}/../company/${res.data.res}`;
        // const fileName = url.split('/').pop();
        // fetch(url)
        //   .then(res => res.blob())
        //   .then(blob => {
        //     const blobUrl = window.URL.createObjectURL(new Blob(blob));
        //     const aTag = document.createElement('a');
        //     aTag.href = blobUrl;
        //     aTag.download = fileName;
        //     document.body.appendChild(aTag);
        //     aTag.click();
        //     aTag.remove();
        //   });
      })
      .catch(err => console.log(err));
  };
  return (
    <StyledTableRow>
      <StyledTableCell sx={{ padding: '10px !important' }}>{lable}</StyledTableCell>
      <StyledTableCell>
        <Stack gap={0.5} direction={{ xs: 'column', sm: 'row' }}>
          {status === 0 ? (
            'File Not Uploaded Yet!'
          ) : (
            <>
              <Button
                value='2'
                onClick={handleAction}
                size='small'
                variant='contained'
                color='success'>
                Approve
              </Button>
              <Button
                value='3'
                onClick={handleAction}
                size='small'
                variant='contained'
                color='error'>
                Reject
              </Button>
              <a
                href={`${axios.defaults.url}action.php?id=${clientID}&action=1&name=${name}`}
                download>
                <Button value='1' size='small' variant='contained'>
                  Download
                </Button>
              </a>
            </>
          )}
        </Stack>
      </StyledTableCell>
      <StyledTableCell align='right'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingInline: '10px',
          }}>
          {status === 1 ? (
            <Alert className='alert' variant='filled' color='warning' severity='info'>
              In Process
            </Alert>
          ) : status === 2 ? (
            <Alert className='alert' variant='filled' severity='success'>
              Approved
            </Alert>
          ) : status === 3 ? (
            <Alert
              className='alert'
              variant='filled'
              color='error'
              iconMapping={{
                success: <WarningAmberIcon fontSize='inherit' />,
              }}>
              Rejected
            </Alert>
          ) : (
            <Alert className='alert' severity='warning'>
              Not Uploaded
            </Alert>
          )}
        </div>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default MyTableRow;
