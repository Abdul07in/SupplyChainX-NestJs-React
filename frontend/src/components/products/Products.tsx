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
import { useProducts } from '../../hooks/queries/useProducts';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import LoadingFallback from '../common/LoadingFallback';

const ProductSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  sku: Yup.string().required('SKU is required'),
  category: Yup.string().required('Category is required'),
  price: Yup.number().positive('Price must be positive').required('Price is required'),
  stockQuantity: Yup.number().min(0, 'Stock quantity cannot be negative').required('Stock quantity is required'),
  description: Yup.string().required('Description is required'),
});

const Products: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useProducts();

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        updateProduct({ id: editingProduct.id, productData: values });
      } else {
        createProduct(values);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(GLOBAL_CONSTANTS.MESSAGES.CONFIRM_DELETE)) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setOpen(true);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingFallback message="Loading products..." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {GLOBAL_CONSTANTS.PRODUCTS.TITLE}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
          disabled={isCreating}
        >
          {GLOBAL_CONSTANTS.PRODUCTS.ADD_NEW}
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
          placeholder="Search products..."
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
              <TableCell>{GLOBAL_CONSTANTS.PRODUCTS.NAME}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.PRODUCTS.SKU}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.PRODUCTS.CATEGORY}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.PRODUCTS.PRICE}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.PRODUCTS.STOCK_QUANTITY}</TableCell>
              <TableCell>{GLOBAL_CONSTANTS.ACTIONS.ACTIONS}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Chip
                    label={product.stockQuantity}
                    color={product.stockQuantity < 20 ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleEdit(product)} 
                    color="primary"
                    disabled={isUpdating}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(product.id)} 
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
          {editingProduct ? GLOBAL_CONSTANTS.PRODUCTS.EDIT : GLOBAL_CONSTANTS.PRODUCTS.ADD_NEW}
        </DialogTitle>
        <Formik
          initialValues={{
            name: editingProduct?.name || '',
            sku: editingProduct?.sku || '',
            category: editingProduct?.category || '',
            price: editingProduct?.price || '',
            stockQuantity: editingProduct?.stockQuantity || '',
            description: editingProduct?.description || '',
          }}
          validationSchema={ProductSchema}
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
                      label={GLOBAL_CONSTANTS.PRODUCTS.NAME}
                      error={touched.name && errors.name}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="sku"
                      label={GLOBAL_CONSTANTS.PRODUCTS.SKU}
                      error={touched.sku && errors.sku}
                      helperText={touched.sku && errors.sku}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="category"
                      label={GLOBAL_CONSTANTS.PRODUCTS.CATEGORY}
                      error={touched.category && errors.category}
                      helperText={touched.category && errors.category}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="price"
                      label={GLOBAL_CONSTANTS.PRODUCTS.PRICE}
                      type="number"
                      error={touched.price && errors.price}
                      helperText={touched.price && errors.price}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="stockQuantity"
                      label={GLOBAL_CONSTANTS.PRODUCTS.STOCK_QUANTITY}
                      type="number"
                      error={touched.stockQuantity && errors.stockQuantity}
                      helperText={touched.stockQuantity && errors.stockQuantity}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      name="description"
                      label={GLOBAL_CONSTANTS.PRODUCTS.DESCRIPTION}
                      multiline
                      rows={3}
                      error={touched.description && errors.description}
                      helperText={touched.description && errors.description}
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

export default Products;