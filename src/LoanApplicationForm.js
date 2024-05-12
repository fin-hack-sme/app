import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material/styles';

function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    tanNumber: '',
    loanAmount: '',
    tenure: '',
    applicantName: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      fetch('https://finhack-sme-loan-api-q6wnl32pqq-el.a.run.app/validate_tan_pan_din', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };

  const validate = (data) => {
    let errors = {};
    if (!data.applicantName) errors.applicantName = "Applicant Name is required";
    if (!data.tanNumber) errors.tanNumber = "TAN Number is required";
    if (!data.loanAmount) errors.loanAmount = "Loan Amount is required";
    if (!data.tenure) errors.tenure = "Tenure is required";
    return errors;
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#007BFF',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" gutterBottom>
          Loan Application Form
        </Typography>
        {isSubmitted ? (
          <Typography variant="h5" component="h2" gutterBottom>
            Your application is under review.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField label="Applicant Name" name="applicantName" value={formData.applicantName} onChange={handleChange} fullWidth margin="normal" error={!!formErrors.applicantName} helperText={formErrors.applicantName} />
            <TextField label="TAN Number" name="tanNumber" value={formData.tanNumber} onChange={handleChange} fullWidth margin="normal" error={!!formErrors.tanNumber} helperText={formErrors.tanNumber} />
            <TextField label="Loan Amount" name="loanAmount" value={formData.loanAmount} onChange={handleChange} fullWidth margin="normal" error={!!formErrors.loanAmount} helperText={formErrors.loanAmount} type="number" />
            <TextField label="Tenure" name="tenure" value={formData.tenure} onChange={handleChange} fullWidth margin="normal" error={!!formErrors.tenure} helperText={formErrors.tenure} type="number" />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default LoanApplicationForm;