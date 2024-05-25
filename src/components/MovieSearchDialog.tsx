
import {
  TableContainer, Paper, Table, TableBody, TableCell, Button, TableHead, Box, TableRow, TableSortLabel, Typography, Link, MenuItem,Checkbox,ListItemText
  , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, TextField, FormControl, InputLabel, Input, OutlinedInput, Autocomplete, Select, SelectChangeEvent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import * as React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

const Item = styled('div')(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' ? '#444d58' : '#ced7e0',
  padding: theme.spacing(2),
  borderRadius: '4px',
  display: 'flex'
}));

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'News',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War'
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const RatingFormat = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        valueIsNumericString
        decimalScale={1}
        decimalSeparator="."
        allowNegative={false}
        isAllowed={(values: any) => {

          return values.floatValue <= 10 || !values.floatValue;
        }}
      />
    );
  },
);

const MetascoreFormat = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        valueIsNumericString

        decimalSeparator="."
        decimalScale={0}
        allowNegative={false}
        isAllowed={(values: any) => {
          console.log(values);



          return values.floatValue <= 100 || !values.floatValue;
        }}
      />
    );
  },
);

export const MovieSearchDialog = (props: any) => {


  const [yearsList, setYearList] = useState([] as string[]);

  const shouldLoad = useRef(true);

  //const [genresList, setGenresList] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof props.searchData.genresSearch>) => {
    const {
      target: { value },
    } = event;
    props.setSearchData({
      ...props.searchData,
      genresSearch: typeof value === 'string' ? value.split(',') : value
  });
  };

  useEffect(() => {
    if (shouldLoad.current) {
      shouldLoad.current = false;

      const currentYear: number = new Date().getFullYear();

      let tmpYearsList = [];

      for (let i = currentYear; i >= 1900; i--) {

        tmpYearsList.push(i.toString());
      }

      setYearList(tmpYearsList);

    }

  }, []);

  const doSearchRequest = () => {
    props.dialogOpenFunc(false);
    props.pageNumFunc(1);

    props.loadDataFunc(1, props.orderBy, props.order);


  }


  return (

    <Dialog open={props.dialogOpen} onClose={() => props.dialogOpenFunc(false)} aria-labelledby='dialog-search-movie' aria-describedby='movie-search-content'>
      <DialogTitle id='dialog-search-movie'>Search movie</DialogTitle>
      <DialogContent id='movie-search-content'>
        <Box sx={{ width: '50%', margin: '5% auto' }}>

          <Grid item xs={12}>
            <Item>
              <TextField sx={{ margin: "1rem" }} fullWidth label='Testo' variant="outlined" value={props.searchData.titleSearch} onChange={(e: any) => {

                const { value } = e.target;
                props.setSearchData({
                  ...props.searchData,
                  titleSearch: value
                });

              }}></TextField>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField sx={{ margin: "1rem" }} fullWidth label='Min user rating' variant="outlined"
                InputProps={{
                  inputComponent: RatingFormat as any,
                }}
                value={props.searchData.minRatingSearch} onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    minRatingSearch: value
                  });

                }}></TextField>


              <TextField
                label="Max user rating"
                fullWidth
                sx={{ margin: "1rem" }}
                value={props.searchData.maxRatingSearch}
                onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    maxRatingSearch: value
                  });


                }}

                InputProps={{
                  inputComponent: RatingFormat as any,
                }}
                variant="outlined"
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextField sx={{ margin: "1rem" }} fullWidth label='Min metascore' variant="outlined"
                InputProps={{
                  inputComponent: MetascoreFormat as any,
                }}
                value={props.searchData.minMetascoreSearch} onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    minMetascoreSearch: value
                  });

                }}></TextField>


              <TextField
                label="Max metascore"
                fullWidth
                sx={{ margin: "1rem" }}
                value={props.searchData.maxMetascoreSearch}
                onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    maxMetascoreSearch: value
                  });


                }}

                InputProps={{
                  inputComponent: MetascoreFormat as any,
                }}
                variant="outlined"
              />
            </Item>

          </Grid>

          <Grid item xs={6}>
            <Item>
              <TextField sx={{ margin: "1rem" }} fullWidth label='Min user num ratings' variant="outlined"
                InputProps={{
                  inputComponent: MetascoreFormat as any,
                }}
                value={props.searchData.minUserNumRatingSearch} onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    minUserNumRatingSearch: value
                  });

                }}></TextField>


              <TextField
                label="Max user num ratings"
                fullWidth
                sx={{ margin: "1rem" }}
                value={props.searchData.maxUserNumRatingSearch}
                onChange={(e: any) => {
                  const { value } = e.target;
                  props.setSearchData({
                    ...props.searchData,
                    maxUserNumRatingSearch: value
                  });


                }}

                InputProps={{
                  inputComponent: MetascoreFormat as any,
                }}
                variant="outlined"
              />
            </Item>

          </Grid>

          <Grid item xs={6}>
            <Item>
              <Autocomplete
                disablePortal

                options={yearsList}
                value={props.searchData.fromYearSearch}
                sx={{ width: 300 }}
                onChange={(event, newValue: string | null) => {

                  props.setSearchData({
                    ...props.searchData,
                    fromYearSearch: newValue
                  });

                }}
                renderInput={(params) => <TextField {...params} label="From year" />}

              />


              <Autocomplete
                disablePortal

                options={yearsList}
                sx={{ width: 300 }}
                value={props.searchData.toYearSearch}
                onChange={(event, newValue: string | null) => {

                  props.setSearchData({
                    ...props.searchData,
                    toYearSearch: newValue
                  });

                }}
                renderInput={(params) => <TextField {...params} label="To year" />}

              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>

              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="genres-multiple-checkbox-label">Genres</InputLabel>
                <Select
                  labelId="genres-multiple-checkbox-label"
                  id="genres-multiple-checkbox"
                  multiple
                  value={props.searchData.genresSearch}
                  onChange={handleChange}
                  input={<OutlinedInput label="Genres" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {genres.map((genre) => (
                    <MenuItem key={genre} value={genre}>
                      <Checkbox checked={props.searchData.genresSearch.indexOf(genre) > -1} />
                      <ListItemText primary={genre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Item>

          </Grid>

        </Box>


      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.dialogOpenFunc(false)}>Cancel</Button>
        <Button autoFocus onClick={doSearchRequest}>Search</Button>

      </DialogActions>

    </Dialog>
  )

}