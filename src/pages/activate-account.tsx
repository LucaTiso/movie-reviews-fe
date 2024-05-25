import axios from 'axios';
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Grid, Paper, Avatar, Link, FormControlLabel, Checkbox, Box, Stack, FormControl, InputLabel, Input, OutlinedInput, Alert } from '@mui/material';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { IMaskInput } from 'react-imask';
import * as React from 'react';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}


const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00000000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  },
);

export const ActivateAccount = () => {

  const navigate = useNavigate();

  let [activationToken, setActivationToken] = useState("");
  let [accountActivated, setAccountActivated] = useState(false);

  let [activationError, setActivationError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActivationToken(event.target.value);
  };




  const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "3rem auto" };
  const spacingStyle = { margin: "0.5rem 0" };
  const homeButtonStyle = { margin: "1rem 0", whith: 300 };


  const activeteAccount = async () => {

    let token = parseInt(activationToken);

    axios.get("http://localhost:8080/api/auth/activate-account?token=" + token)
      .then((response: any) => {

        console.log("account activated");
        setActivationError("");
        setAccountActivated(true);
      })
      .catch((error: any) => {

        setActivationError("Il codice inserito non è valido");
        console.log("errore nell'attivazione del token");
        console.log(error);
      })
  }


  return (

    !accountActivated ?
      <Paper elevation={10} style={paperStyle}>
        {
          activationError !== "" ?
            <Stack spacing={2}>
              <Alert severity='error' variant='standard' onClose={() => { setActivationError("") }}>{activationError}</Alert>
            </Stack> : null
        }
        <FormControl>
          <InputLabel htmlFor="formatted-text-mask-input">Activation code</InputLabel>
          <OutlinedInput
            value={activationToken}
            onChange={handleChange}
            name="textmask"
            id="formatted-text-mask-input"
            label="Activation code"
            inputComponent={TextMaskCustom as any}
          />
        </FormControl>


        <Button type="submit" color="primary" fullWidth variant="contained" style={spacingStyle}
          onClick={activeteAccount}>Invia</Button>



      </Paper> :

      <Paper elevation={10} style={paperStyle}>
        <Typography>L'account è stato attivato</Typography>
        <Box textAlign="center" style={homeButtonStyle}>
          <Button type="submit" color="primary" variant="contained" onClick={() => navigate("/login")}>Vai al login</Button>
        </Box>

      </Paper>


  )

}