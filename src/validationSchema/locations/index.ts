import * as yup from 'yup';

export const locationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  image: yup.string(),
  budget_friendly: yup.boolean().required(),
});
