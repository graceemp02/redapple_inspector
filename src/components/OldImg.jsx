/** @format */

import { Box, Button, Typography, LinearProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MachineContext } from '../context/MachineContext';
import MyDialog from './MyDialog';
const isWithin5Days = insDate => {
  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  return insDate >= fiveDaysAgo && insDate <= fiveDaysFromNow;
};
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress sx={{ borderRadius: '100vw' }} variant='determinate' {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
const OldImg = ({ date }) => {
  const imgRef = useRef();
  const [progress, setProgress] = useState(0);
  const [isAllowed, setAllowed] = useState(true);
  const [dialog, setDialog] = useState({ status: false, msg: '', title: '' });
  const { machineID } = useContext(MachineContext);
  const [url, setUrl] = useState();
  const cancleToken = axios.CancelToken;
  const source = cancleToken.source();
  const getImg = async () => {
    await axios
      .get(`filterImg.php?api=${machineID}&name=inspectionPicBefore`, {
        cancelToken: source.cancelToken,
      })
      .then(res => {
        res.data.res ? setUrl(`${axios.defaults.baseURL}/${res.data.res}`) : setUrl();
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getImg();
    return () => {
      source.cancel();
    };
  }, [machineID]);
  useEffect(() => {
    isWithin5Days(new Date(date)) ? setAllowed(true) : setAllowed(false);
  });
  const handleSubmit = async e => {
    e.preventDefault();
    if (imgRef.current.files[0]) {
      let fd = new FormData();
      fd.append('img', imgRef.current.files[0]);
      fd.append('name', 'inspectionPicBefore');
      fd.append('api', machineID);
      await axios
        .post('filterImg.php', fd, {
          onUploadProgress: ({ loaded, total }) => {
            const p = Math.round((loaded / total) * 100);
            setProgress(p);
          },
        })
        .then(result => {
          const res = result.data.res;
          if (res === 'true') {
            setDialog({
              msg: 'Old Filter Image is Uploaded Successfully.',
              title: 'SUCCESS',
              status: true,
            });
            getImg();
          } else {
            setDialog({
              msg: res,
              title: 'FAILURE',
              status: true,
            });
          }
        })
        .catch(err => {
          console.log(err);
          setDialog({
            msg: 'Sorry Image is not uploaded. Please try again!',
            title: 'FAILURE',
            status: true,
          });
        });
      imgRef.current.value = null;
    }
  };
  return (
    <Box
      sx={{
        flex: 1,
        border: '2px solid black',
        m: 0.5,
        borderRadius: 2,
        height: 'fit-content',
      }}>
      <Typography variant='h6' fontWeight='bold' color='rgba(0,0,0,0.9)'>
        Old Filter Picture
      </Typography>
      {isAllowed && (
        <form className='img-form' onSubmit={handleSubmit}>
          <input required ref={imgRef} type='file' accept='image/*' />
          <Button type='submit' variant='contained' color='success'>
            Upload
          </Button>
        </form>
      )}
      {progress > 0 && progress < 100 && (
        <Box sx={{ width: '100%' }}>
          <LinearProgressWithLabel value={progress} />
        </Box>
      )}
      {url ? (
        <img width='100%' src={url} />
      ) : (
        <Typography
          sx={{ paddingBlock: 2, color: 'rgba(0,0,0,0.8)', borderTop: '2px solid black' }}>
          Filter image is not uploaded for selected machine yet!
        </Typography>
      )}
      {/* <img width='100%' src='https://source.unsplash.com/random' /> */}
      {dialog.status && (
        <MyDialog
          title={dialog.title}
          des={dialog.msg}
          actions={[{ onClick: () => setDialog({ status: false }), color: 'primary', text: 'OK' }]}
        />
      )}
    </Box>
  );
};

export default OldImg;
