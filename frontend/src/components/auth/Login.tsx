import React from 'react';
import { Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../hooks/queries/useAuth';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const { isAuthenticated, login, isLoggingIn, loginError } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    login(values);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {GLOBAL_CONSTANTS.AUTH.LOGIN_TITLE}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {GLOBAL_CONSTANTS.AUTH.LOGIN_SUBTITLE}
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  name="email"
                  label={GLOBAL_CONSTANTS.AUTH.EMAIL_LABEL}
                  type="email"
                  margin="normal"
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                  disabled={isLoggingIn}
                />

                <Field
                  as={TextField}
                  fullWidth
                  name="password"
                  label={GLOBAL_CONSTANTS.AUTH.PASSWORD_LABEL}
                  type="password"
                  margin="normal"
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                  disabled={isLoggingIn}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoggingIn || isSubmitting}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {isLoggingIn ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    GLOBAL_CONSTANTS.AUTH.LOGIN_BUTTON
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;