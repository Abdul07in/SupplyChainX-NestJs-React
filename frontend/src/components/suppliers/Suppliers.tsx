import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useSuppliers } from '../../hooks/queries/useSuppliers';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import LoadingFallback from '../common/LoadingFallback';

const SupplierSchema = Yup.object().shape({
  name: Yup.string().required('Supplier name is required'),
  contactPerson: Yup.string().required('Contact person is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
});

const Suppliers: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    suppliers,
    isLoading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useSuppliers();

  const handleClose = () => {
    setOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      const supplierData = { ...values, status: 'Active' };
      if (editingSupplier) {
        updateSupplier({ id: editingSupplier.id, supplierData });
      } else {
        createSupplier(supplierData);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(GLOBAL_CONSTANTS.MESSAGES.CONFIRM_DELETE)) {
      deleteSupplier(id);
    }
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setOpen(true);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingFallback message="Loading suppliers..." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {GLOBAL_CONSTANTS.SUPPLIERS.TITLE}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={isCreating}
        >
          {GLOBAL_CONSTANTS.SUPPLIERS.ADD_NEW}
        </Button>
      </Box>

      {(error || createError || updateError || deleteError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || createError || updateError || deleteError}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{GLOBAL_CONSTANTS.SUPPLIERS.NAME}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.SUPPLIERS.CONTACT_PERSON}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.SUPPLIERS.EMAIL}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.SUPPLIERS.PHONE}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.SUPPLIERS.STATUS}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.ACTIONS.ACTIONS}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={supplier.status}
                    color={supplier.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(supplier)} 
                    color="primary"
                    disabled={isUpdating}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(supplier.id)} 
                    color="error"
                    disabled={isDeleting}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSupplier ? GLOBAL_CONSTANTS.SUPPLIERS.EDIT : GLOBAL_CONSTANTS.SUPPLIERS.ADD_NEW}
        </DialogTitle>
        <Formik
          initialValues={{
            name: editingSupplier?.name || '',
            contactPerson: editingSupplier?.contactPerson || '',
            email: editingSupplier?.email || '',
            phone: editingSupplier?.phone || '',
            address: editingSupplier?.address || '',
          }}
          validationSchema={SupplierSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="name"
                      label={GLOBAL_CONSTANTS.SUPPLIERS.NAME}
                      error={touched.name && errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="contactPerson"
                      label={GLOBAL_CONSTANTS.SUPPLIERS.CONTACT_PERSON}
                      error={touched.contactPerson && errors.contactPerson}
                      helperText={touched.contactPerson && errors.contactPerson}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="email"
                      label={GLOBAL_CONSTANTS.SUPPLIERS.EMAIL}
                      type="email"
                      error={touched.email && errors.email}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="phone"
                      label={GLOBAL_CONSTANTS.SUPPLIERS.PHONE}
                      error={touched.phone && errors.phone}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="address"
                      label={GLOBAL_CONSTANTS.SUPPLIERS.ADDRESS}
                      multiline
                      rows={3}
                      error={touched.address && errors.address}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} disabled={isCreating || isUpdating}>
                  {GLOBAL_CONSTANTS.ACTIONS.CANCEL}
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isCreating || isUpdating}
                >
                  {GLOBAL_CONSTANTS.ACTIONS.SAVE}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default Suppliers;