import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-1"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 opacity-90"
          >
            Sign in to access your account
          </motion.p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            const res = await login(values.email, values.password);
            setIsSubmitting(false);
            
            if (res.success) {
              if (res.user && res.user.role === 'admin') {
                navigate("/admin/dashboard");
              } else {
                navigate("/");
              }
            } else {
              alert(res.message);
            }
          }}
        >
          {({ touched, errors }) => (
            <Form className="p-6 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Field 
                  name="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.email && errors.email 
                      ? 'border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="text-red-600 text-sm mt-1 font-medium" 
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Field 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full px-4 py-3 rounded-lg border ${
                    touched.password && errors.password 
                      ? 'border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="text-red-600 text-sm mt-1 font-medium" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button 
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button 
                type="submit" 
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Sign In
                  </span>
                )}
              </motion.button>


              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                Don't have an account?{" "}
                <button 
                  onClick={() => navigate("/signup")} 
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Sign up
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
};

export default Login;