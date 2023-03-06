/** @format */

import { Alert, Button, TextField, Typography } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MyDialog from './MyDialog';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ClientContext } from '../context/ClientContext';

const DateInput = () => {
  const { clientID } = useContext(ClientContext);
  const [value, setValue] = useState(dayjs(new Date()));
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const [shrk, setShrk] = useState(false);
  const ref = useRef();
  useEffect(() => {
    axios
      .get(`checkInput.php?id=${clientID}&name=finishDate`)
      .then(res => {
        const data = res.data.res;
        if (data) {
          setShrk(true);
          setValue(data);
        } else {
          setShrk(false);
        }
      })
      .catch(err => console.log(err));
  }, [clientID]);
  const handleSubmit = async e => {
    e.preventDefault();
    const date = `${value.$y}-${value.$M + 1}-${value.$D}`;
    let fd = new FormData();
    fd.append('id', clientID);
    fd.append('value', date);
    fd.append('name', 'finishDate');
    await axios
      .post(`checkInput.php`, fd)
      .then(res => {
        if (res.data.res) {
          setShrk(true);
          setDialog({
            status: true,
            title: 'Success',
            msg: ` Updated Successfully`,
          });
        } else {
          setDialog({
            msg: 'Sorry, there was an error. Please try again',
            title: 'FAILURE',
            status: true,
          });
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <div className='input-column'>
      <Typography className='input-lable'>Finishing date scheduled</Typography>
      <form className='inner-txt-form' onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat='MMMM DD, YYYY'
            disableMaskedInput
            required
            label='Termination Date'
            ref={ref}
            value={value}
            onChange={newValue => setValue(newValue)}
            renderInput={params => (
              <TextField
                required
                size='small'
                sx={{ fontSize: '1.7vh', mr: 1, mb: { xs: 1, lg: 0 }, display: 'inline' }}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
        <div className='text-btn-status' style={{ display: 'flex' }}>
          <Button color='success' type='submit' variant='contained' sx={{ mr: 1 }}>
            Update
          </Button>

          {shrk ? (
            <Alert className='alert' severity='success'>
              Uploaded
            </Alert>
          ) : (
            <Alert className='alert' severity='warning'>
              Not Uploaded
            </Alert>
          )}
        </div>
      </form>

      {dialog.status && (
        <MyDialog
          title={dialog.title}
          des={dialog.msg}
          actions={[{ onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' }]}
        />
      )}
    </div>
  );
};

export default DateInput;
