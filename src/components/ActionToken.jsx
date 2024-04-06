import React from "react";
import { ACTION_TYPE } from "../constants/actionType";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

export const ActionToken = ({ actionType }) => {
  const controller = (actionType) => {
    if (ACTION_TYPE.BUY === actionType) {
    } else if (ACTION_TYPE.SELL === actionType) {
    }
  };
  return (
    <>
      <Stack spacing={2} direction="row">
        <TextField
          id="outlined-basic"
          placeholder="Price/Token"
          variant="outlined"
          type="number"
          disabled
        />
        <TextField
          id="outlined-basic"
          label="SL"
          variant="outlined"
          type="number"
        />
        <Button variant="contained" color="success">
          {actionType}
        </Button>
      </Stack>
      <Typography>2$ ~ 20 MEMO</Typography>
    </>
  );
};
