import * as yup from "yup";

export const SignUp = yup.object({
  name: yup.string().min(3).max(20).required(),
  email: yup.string(),
  phone: yup.string().required(),
  password: yup.string().required(),
  address: yup.string().required(),
  shopname: yup.string().required(),
});

export const Login=yup.object({
    phone:yup.string().required(),
    password:yup.string().required()
})