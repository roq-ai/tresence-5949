import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getLocationById, updateLocationById } from 'apiSdk/locations';
import { Error } from 'components/error';
import { locationValidationSchema } from 'validationSchema/locations';
import { LocationInterface } from 'interfaces/location';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

function LocationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<LocationInterface>(
    () => (id ? `/locations/${id}` : null),
    () => getLocationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: LocationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateLocationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/locations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<LocationInterface>({
    initialValues: data,
    validationSchema: locationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Location
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="image" mb="4" isInvalid={!!formik.errors?.image}>
              <FormLabel>Image</FormLabel>
              <Input type="text" name="image" value={formik.values?.image} onChange={formik.handleChange} />
              {formik.errors.image && <FormErrorMessage>{formik.errors?.image}</FormErrorMessage>}
            </FormControl>
            <FormControl
              id="budget_friendly"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.budget_friendly}
            >
              <FormLabel htmlFor="switch-budget_friendly">Budget Friendly</FormLabel>
              <Switch
                id="switch-budget_friendly"
                name="budget_friendly"
                onChange={formik.handleChange}
                value={formik.values?.budget_friendly ? 1 : 0}
              />
              {formik.errors?.budget_friendly && <FormErrorMessage>{formik.errors?.budget_friendly}</FormErrorMessage>}
            </FormControl>

            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'location',
    operation: AccessOperationEnum.UPDATE,
  }),
)(LocationEditPage);
