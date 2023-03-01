/** @format */

import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Stack, TableRow, Alert } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { ClientContext } from '../context/ClientContext';
import MyDialog from './MyDialog';
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
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`../company/fileInput.php?id=${clientID}&status=${name}Status`)
        .then(res => {
          setStatus(+res.data.res);
        })
        .catch(err => console.log(err.message));
    }, 1000);
    return () => clearInterval(interval);
  }, [clientID]);
  // useEffect(() => {
  //   console.log('Client changed');
  //   setInterval(() => {
  //     console.count(clientID);
  //     axios
  //       .get(
  //         `../company/fileInput.php?id=${localStorage.getItem('ins_client')}&status=${name}Status`
  //       )
  //       .then(res => {
  //         setStatus(+res.data.res);
  //       })
  //       .catch(err => console.log(err.message));
  //   }, 2000);
  //   // return () => clearInterval(inv);
  // }, [clientID]);
  const handleAction = async e => {
    await axios
      .get(`action.php?id=${clientID}&action=${e.target.value}&name=${name}`)
      .then(res => {
        if (res.data.res === 'true') {
          axios
            .get(`../company/fileInput.php?id=${clientID}&status=${name}Status`)
            .then(res => {
              setStatus(+res.data.res);
            })
            .catch(err => console.log(err.message));
          setDialog({
            status: true,
            title: 'Success',
            msg: `Status Updated Successfully`,
          });
        }
      })
      .catch(err => console.log(err));
  };
  const handleDownload = async () => {
    await axios
      .get(`action.php?id=${clientID}&action=1&name=${name}`)
      .then(res => {
        const url = `${axios.defaults.baseURL}/../company/${res.data.res}`;
        const fileName = url.split('/').pop();
        const aTag = document.createElement('a');
        aTag.href = url;
        aTag.download = fileName;
        aTag.target = '_blank';
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
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

              <Button onClick={handleDownload} size='small' variant='contained'>
                Download
              </Button>
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
        {dialog.status && (
          <MyDialog
            title={dialog.title}
            des={dialog.msg}
            actions={[
              { onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' },
            ]}
          />
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default MyTableRow;
