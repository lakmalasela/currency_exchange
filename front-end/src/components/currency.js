import React, { useEffect } from 'react';
import { useState } from 'react';
import { 
  Container,
  TextField,
  MenuItem, 
  Button,
  Typography,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Grid,
  IconButton,
  SnackbarContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons'; 
import axios from 'axios';

const Currency = ()=>{

  const baseUrl = process.env.REACT_APP_SERVER_API_URL;
  const currencyExchange = process.env.REACT_APP_EXCHANGE_RATE_API;


  const[allrates,setRates] = useState({});
  const[fromcountries,setfromCountries] = useState([]);
  const[tocountries,settoCountries] = useState([]);
  
  const[selectFromCountry,setselectFromCountry] = useState("");
  const[selectToCountry,setselectToCountry] = useState("");

  const [selectFromCountryName, setselectFromCountryName] = useState("");
  const [selectToCountryName, setselectToCountryName] = useState("");
  
  const[amount,setAmount] = useState('');
  const[result,setResult] = useState('');
  const [errors, setErrors] = useState({ fromCountry: false, toCountry: false, amount: false });

  //alert
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [submitting, setSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);


  useEffect(() =>{
    const fetchCountries = async () =>{
      try{
      
        //get the rates initial
        const responserates = await axios.get(`${currencyExchange}/USD`);
        setRates(responserates.data.rates);
      

        const responsecountry = await axios.get(`${baseUrl}/country`);
        setfromCountries(responsecountry.data);

        settoCountries(responsecountry.data);
        

        const response = await axios.get(`${baseUrl}/transfer`);
        setTableData(response.data);
        
      }catch(error){
        console.log("Error fetching country",error);
      }
    };
    fetchCountries();
  },[tableData,baseUrl, currencyExchange]);



  
  //get the rates by select from country and set the from country name
  const handleFromCountryChange = async (event) => {
    setselectFromCountry(event.target.value);
    const selectedCountryCode = event.target.value;
    
     //set the country name
    const selectedCountry = fromcountries.find(country => country.code === selectedCountryCode);
    setselectFromCountryName(selectedCountry.countryname); 

    try {
      const responserates = await axios.get(`${currencyExchange}/${selectedCountryCode}`);
      setRates(responserates.data.rates);
    } catch (error) {
      console.log(`Error fetching rates for ${selectedCountryCode}`, error);
    }
  };

  //set the To country name
  const handleToCountryChange = (event) => {
    setselectToCountry(event.target.value);
    const selecttocountry = event.target.value;
    

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
     
      try{
         
          console.log("C NAME T ",selectToCountryName);
          
        const responsesavetransfer = await axios.post(`${baseUrl}/transfer` ,{
          fromcountryname:selectFromCountryName,
          tocountryname: selectToCountryName,
          amount: convertedAmount

        });

        setTableData([...tableData, responsesavetransfer.data]);

        // Clear form fields and reset result
        setselectFromCountry("");
        setselectToCountry("");
        setAmount("");
        setSnackbarMessage("Record successfully added!");
        setOpenSnackbar(true); // Open Snackbar on successful submission
        setSubmitting(false); // Reset submitting state after completion
      }catch(error){
        console.log("Error saving transfer", error);
      }
    } else {
      console.log("Please correct the errors before submitting.");
    }



  }

  


  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //delete record
  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/transfer/${deleteItemId}`);
      const updatedData = tableData.filter(item => item._id !== deleteItemId);
      setTableData(updatedData);
      setSnackbarMessage("Record successfully deleted!");
      setOpenSnackbar(true);
    } catch (error) {
      console.log("Error deleting record", error);
    } finally {
      setDeleteDialogOpen(false);
      setDeleteItemId(null);
    }
  };

  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  const handleDelete = async (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  //currency set the amount
  const formatAmount = (amount, countryName) => {
    if (countryName === "Sri Lanka") {
      return `${amount.toFixed(2)} LKR`;
    } else if (countryName === "Australia") {
      return `${amount.toFixed(2)} AUD`;
    } else if(countryName === "USA"){
      return `${amount.toFixed(2)} USD`;
    }else if(countryName === "India"){
      return `${amount.toFixed(2)} INR`;
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
        <Typography style={{marginTop:'20px'}} variant='h4' gutterBottom>Transfer History</Typography>
      <TableContainer component={Paper} style={{ marginTop: '60px' }}>
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
                <TableCell>
                  {/* {row.amount && row.amount.toFixed(2)} */}
                  {row.amount && formatAmount(row.amount, row.tocountryname)}
                  </TableCell>

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
      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          style={{ backgroundColor: 'green' }}
          message={snackbarMessage}
        />
      </Snackbar>


       {/* Delete Confirmation Dialog */}
       <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete?"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this record?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )

}
export default Currency;
