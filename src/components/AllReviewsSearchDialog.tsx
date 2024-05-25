import { Dialog, DialogTitle, DialogContent, Box, Grid, TextField ,Button,DialogActions} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


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
                decimalScale={0}
                allowNegative={false}
                isAllowed={(values: any) => {

                    return values.floatValue <= 10 || !values.floatValue;
                }}
            />
        );
    },
);

export const AllReviewsSearchDialog = (props: any) => {

    
    const doSearchRequest = () => {
        props.dialogOpenFunc(false);
        props.pageNumFunc(1);

       
    
        props.loadDataFunc(props.movieId,1, props.orderBy, props.order);
    
    
      }
    


    return (

        <Dialog open={props.dialogOpen} onClose={() => props.dialogOpenFunc(false)} aria-labelledby='dialog-search-metacritic' aria-describedby='metacritic-search-content'>
            <DialogTitle id='dialog-search-metacritic'>Search review</DialogTitle>
            <DialogContent id='metacritic-search-content'>
                <Box sx={{ width: '50%', margin: '5% auto' }}>
                <Grid item xs={12}>
                        <Item>
                            <TextField sx={{ margin: "1rem" }} fullWidth label='Title' variant="outlined" value={props.searchData.titleSearch} onChange={(e: any) => {

                                const { value } = e.target;
                                props.setSearchData({
                                    ...props.searchData,
                                    titleSearch: value
                                });

                            }}></TextField>
                        </Item>
                    </Grid>
                    <Grid item xs={12}>
                        <Item>
                            <TextField sx={{ margin: "1rem" }} fullWidth label='Username' variant="outlined" value={props.searchData.usernameSearch} onChange={(e: any) => {

                                const { value } = e.target;
                                props.setSearchData({
                                    ...props.searchData,
                                    usernameSearch: value
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

                            <DatePicker
                                label="From review date"
                                defaultValue={props.searchData.fromReviewDateSearch}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    field: { clearable: true, onClear: () =>{

                                        props.setSearchData({
                                            ...props.searchData,
                                            fromReviewDateSearch: null
                                        });
                                    } },
                                  }}
                                onChange={(e: any) => {
                                  
                                   
                                    props.setSearchData({
                                        ...props.searchData,
                                        fromReviewDateSearch: e
                                    });


                                }}
                            />

                        </Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>

                            <DatePicker
                                label="To review date"
                                defaultValue={props.searchData.toReviewDateSearch}
                                format="DD/MM/YYYY"
                                slotProps={{
                                    field: { clearable: true, onClear: () =>{
                                        
                                        props.setSearchData({
                                            ...props.searchData,
                                            toReviewDateSearch: null
                                        });
                                    } },
                                  }}
                                onChange={(e: any) => {
                                    
                                    props.setSearchData({
                                        ...props.searchData,
                                        toReviewDateSearch: e
                                    });


                                }}
                            />

                        </Item>
                    </Grid>
                </Box>

            </DialogContent>
            <DialogActions>
            <Button onClick={() => props.dialogOpenFunc(false)}>Cancel</Button>
            <Button autoFocus onClick={doSearchRequest}>Search</Button>

        </DialogActions>
        </Dialog >
    );
}