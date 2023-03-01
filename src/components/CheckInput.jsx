/** @format */

import { Alert, Button, Typography, Checkbox } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MyDialog from './MyDialog';
import { ClientContext } from '../context/ClientContext';

const CheckInput = ({ lable, name }) => {
  const selected = localStorage.getItem('ins_client');
  const { clientID } = useContext(ClientContext);
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const [value, setValue] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    axios
      .get(`checkInput.php?id=${selected}&name=${name}`)
      .then(res => {
        const data = +res.data.res;
        if (data === 1) {
          setValue(true);
          setStatus(true);
        } else {
          setValue(false);
          setStatus(false);
        }
      })
      .catch(err => console.log(err));
  }, [clientID]);
  const handleSubmit = async e => {
    e.preventDefault();
    let fd = new FormData();
    fd.append('id', selected);
    fd.append('value', value ? 1 : 0);
    fd.append('name', name);
    await axios
      .post(`checkInput.php`, fd)
      .then(res => {
        if (res.data.res) {
          setStatus(value);
          setDialog({
            status: true,
            title: 'Success',
            msg: ` Updated Successfully`,
          });
        } else {
          setStatus(value);
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
      <Typography className='input-lable'>{lable}</Typography>
      <form className='inner-txt-form' onSubmit={handleSubmit}>
        <Checkbox checked={value} onChange={(e, newVal) => setValue(newVal)} />
        <Button color='success' type='submit' variant='contained' sx={{ mr: 1 }}>
          Update
        </Button>
        {status ? (
          <Alert className='alert' severity='success'>
            Verified
          </Alert>
        ) : (
          <Alert className='alert' severity='warning'>
            Unverified
          </Alert>
        )}
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

export default CheckInput;
