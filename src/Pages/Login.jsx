import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-35 p-7 border rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          const res = await login(values.email, values.password);
          if (res.success) {
            navigate("/");
          } else {
            alert(res.message);
          }
        }}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <Field name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <Field name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>
 
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Login
            </button>

            <div className="text-center mt-4">
        
            <p className="text-sm">
              Don't have an account?{" "}
          
            <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline" >
              Signup
            </button>
        
            </p>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
