import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container,TextField,MenuItem, Button,Typography, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper ,Grid,IconButton  } from '@material-ui/core';
//import Alert from '@mui/material/Alert';
import { Delete as DeleteIcon } from '@material-ui/icons'; 
import axios from 'axios';

const Currency = ()=>{

  const baseUrl = process.env.SERVER_API_URL;
  const currencyexchange = process.env.EXCHANGE_RATE_API;


  const[allrates,setRates] = useState({});
  const[fromcountries,setfromCountries] = useState([]);
  const[tocountries,settoCountries] = useState([]);
  
  const[selectFromCountry,setselectFromCountry] = useState("");
  const[selectToCountry,setselectToCountry] = useState("");

  const [selectFromCountryName, setselectFromCountryName] = useState("");
  const [selectToCountryName, setselectToCountryName] = useState("");
  //const[country,setCountry] = useState('USD');
  const[amount,setAmount] = useState('');
  const[result,setResult] = useState('');
  const [errors, setErrors] = useState({ fromCountry: false, toCountry: false, amount: false });

  //alert
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [submitting, setSubmitting] = useState(false);


  useEffect(() =>{
    const fetchCountries = async () =>{
      try{
      
        //get the rates initial
        const responserates = await axios.get('currencyexchange/USD');
        setRates(responserates.data.rates);
      

        const responsecountry = await axios.get('baseUrl/country');
        setfromCountries(responsecountry.data);

        settoCountries(responsecountry.data);
        

        const response = await axios.get('baseUrl/transfer');
        setTableData(response.data);
        
      }catch(error){
        console.log("Error fetching country",error);
      }
    };
    fetchCountries();
  },[tableData]);



  
  //get the rates by select from country and set the from country name
  const handleFromCountryChange = async (event) => {
    setselectFromCountry(event.target.value);
    const selectedCountryCode = event.target.value;
    
     //set the country name
    const selectedCountry = fromcountries.find(country => country.code === selectedCountryCode);
    setselectFromCountryName(selectedCountry.countryname); 

    try {
      const responserates = await axios.get(`currencyexchange/${selectedCountryCode}`);
      setRates(responserates.data.rates);
    } catch (error) {
      console.log(`Error fetching rates for ${selectedCountryCode}`, error);
    }
  };

  //set the To country name
  const handleToCountryChange = (event) => {
    setselectToCountry(event.target.value);
    const selecttocountry = event.target.value;
    console.log("OUT ",event.target.value);

    //set the country name
    const selectedCountry = tocountries.find(country => country.code === selecttocountry);
    setselectToCountryName(selectedCountry.countryname);  // Set the country name
  };

  const validateFields = () => {
    const errors = {
      fromCountry: !selectFromCountry,
      toCountry: !selectToCountry,
      amount: !amount || isNaN(amount) || parseFloat(amount) <= 0,
    };
    setErrors(errors);
    return !errors.fromCountry && !errors.toCountry && !errors.amount;
  };

  //submit data
  const handleSubmit = async()=>{
    if (submitting) {
      return;
    }
  
    setSubmitting(true);

    if (validateFields()) {
      const rateTo = allrates[selectToCountry];
      const convertedAmount = amount * rateTo;
      setResult(`Converted Amount: ${convertedAmount.toFixed(2)} ${selectToCountry}`);
      console.log("C NAME F ",selectFromCountryName);
      try{
         
          console.log("C NAME T ",selectToCountryName);
          
        const responsesavetransfer = await axios.post('baseUrl/transfer' ,{
          fromcountryname:selectFromCountryName,
          tocountryname: selectToCountryName,
          amount: convertedAmount

        });

        setTableData([...tableData, responsesavetransfer.data]);

        // Clear form fields and reset result
        setselectFromCountry("");
        setselectToCountry("");
        setAmount("");
        // setOpenSnackbar(true);
        setSubmitting(false); // Reset submitting state after completion
      }catch(error){
        console.log("Error saving transfer", error);
      }
    } else {
      console.log("Please correct the errors before submitting.");
    }


    // if (selectFromCountry && selectToCountry && amount !== '') {
    //   const rateTo = allrates[selectToCountry];

    //   console.log("DDDDDD ",rateTo);
    //   console.log("RRRRRRRR ",allrates);
    //   //Calculate conversion
    //   const convertedAmount = amount * rateTo;

    //   // Display result
    //   setResult(`Converted Amount: ${convertedAmount.toFixed(2)} ${selectToCountry}`);
    // } else {
    //   console.log("Please select currencies and enter amount.");
    // }

  }

  // const handleCloseSnackbar = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenSnackbar(false);
  // };


  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`baseUrl/transfer/${id}`);
      const updatedData = tableData.filter(item => item._id !== id);
      setTableData(updatedData);
    } catch (error) {
      console.log("Error deleting record", error);
    }
  };


  return(
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={6}>
        <Typography style={{marginTop:'20px'}} variant='h4' gutterBottom>Currency Converter</Typography>
      <TextField
        select
        value={selectFromCountry}
        label="Select From Country"
        onChange={handleFromCountryChange}
        fullWidth
        margin="normal"
        error={errors.fromCountry}
        helperText={errors.fromCountry ? "Please select a source country" : ""}
      >
        {fromcountries.map((country)=>(
          <MenuItem key={(country._id)} value={country.code}>
            {country.countryname}
          </MenuItem>
        ))}

      </TextField>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        fullWidth
        margin="normal"
        error={errors.amount}
        helperText={errors.amount ? "Please enter a valid amount" : ""}
      >
      </TextField>

      <TextField
        select
        value={selectToCountry}
        label="Select To Country"
        onChange={handleToCountryChange}
        fullWidth
        margin="normal"
        error={errors.toCountry}
        helperText={errors.toCountry ? "Please select a target country" : ""}
      >
        {tocountries.map((country)=>(
          <MenuItem key={(country._id)} value={country.code}>
            {country.countryname}
          </MenuItem>
        ))}
      </TextField>

      <Button
          variant='contained' color="primary" onClick={handleSubmit} fullWidth>
            Transfer
      </Button>
      {result && (
        <Typography variant='h6' gutterBottom style={{marginTop:'20px'}}>
          {result}
        </Typography>
      )}
        </Grid>
        <Grid item xs={6}>
          
      <TableContainer component={Paper} style={{ marginTop: '100px' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>From Country</TableCell>
              <TableCell>To Country</TableCell>
              <TableCell>Transfer Amount</TableCell>
              <TableCell>Revoke</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.fromcountryname}</TableCell>
                <TableCell>{row.tocountryname}</TableCell>
                <TableCell>{row.amount && row.amount.toFixed(2)}</TableCell>

                <TableCell>
                      <IconButton onClick={() => handleDelete(row._id)} color="secondary">
                         {/* <Typography variant="body2">Revoke</Typography> */}
                         <DeleteIcon />

                      </IconButton>
                    </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
        </Grid>
      </Grid>
     

      {/* alert show */}
      {/* <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Record successfully added!
        </Alert>
      </Snackbar> */}


    </Container>
  )

}
export default Currency;
