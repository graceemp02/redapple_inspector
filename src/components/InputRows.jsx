/** @format */

import { Stack } from '@mui/material';
import React from 'react';
import DateInput from './DateInput';
import CheckInput from './CheckInput';

const InputRows = () => {
  return (
    <Stack gap={1}>
      <DateInput />
      <CheckInput
        lable='Hardware in possession model numbers uploaded'
        name='hardwareModelUploaded'
      />
      <CheckInput lable='Startup crew selected' name='crewSelected' />
      <CheckInput lable='Air balancing teste and results uploaded' name='balanceResultUploaded' />
      <CheckInput lable='Was installation according to design' name='installAccordingDesign' />
      <CheckInput lable='Corrections list itemized' name='list_itemized' />
      <CheckInput
        lable='Corrections list verified by time stamped uploaded pictures'
        name='listVerified'
      />
    </Stack>
  );
};

export default InputRows;
