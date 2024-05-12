import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { Card, CardContent } from '@mui/material';

function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    tanNumber: '',
    loanAmount: '',
    tenure: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [apiResponse, setApiResponse] = useState(null);
  const [inputData, setInputData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setInputData(formData);
      const formData2 = {
        TAN_ID: formData.tanNumber,
        Tenure: 10,
        Requested_Amount: 10,
      };

      fetch('https://finhack-sme-loan-api-q6wnl32pqq-el.a.run.app/predict_loan_approval/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://finhack-sme-loan-api-q6wnl32pqq-el.a.run.app',
          'Referer': 'https://finhack-sme-loan-api-q6wnl32pqq-el.a.run.app/docs',
        },
        body: JSON.stringify(formData2),
      })

        .then(response => response.json())
        .then(data => {
          setApiResponse(data);
          if (data.message === "Invalid TAN Number Provided") {
            setFormErrors({ ...formErrors, tanNumber: data.message });
          } else if (data.data && data.data.prediction === "Rejected") {
            setFormErrors({ ...formErrors, general: "Your loan application was rejected." });
            setIsSubmitted(true); // Add this line
          } else if (data.data && data.data.prediction === "Approved") {
            setIsSubmitted(true);
          }
        })

        // .then(data => {
        //   setApiResponse(data);
        //   if (data.message === "Invalid TAN Number Provided") {
        //     setFormErrors({ ...formErrors, tanNumber: data.message });
        //   } else if (data.data && data.data.prediction === "Rejected") {
        //     setFormErrors({ ...formErrors, general: "Your loan application was rejected." });
        //   } else if (data.data && data.data.prediction === "Approved") {
        //     setIsSubmitted(true);
        //   }
        // })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const validate = (data) => {
    let errors = {};
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
          <>
            <Card variant="outlined" style={{ margin: '20px 0' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Input Data:
                </Typography>
                <Typography variant="body1">
                  {Object.entries(inputData).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Loan Application Status:
                </Typography>
                <Typography variant="body1">
                  {Object.entries(apiResponse).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
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