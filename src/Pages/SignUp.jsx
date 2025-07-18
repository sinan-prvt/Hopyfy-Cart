import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext"

const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email("Invalid Email").required("Email is Required"),
    password: Yup.string().min(6, "Minimum 6 Character").required("Password is Required"),
});


function SignUp() {
const{ signup } = useAuth();
const navigator = useNavigate();

return (
    <>
        <div className="max-w-md mx-auto mt-35 p-6 border rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4" >Sign Up</h2>
            <Formik
                initialValues={{
                    name:"",
                    email:"",
                    password:"",
                }}
                validationSchema={SignUpSchema}
                onSubmit={async (values) => {
                    const newUser = {
                        ...values,
                        role: "user",
                        isBlock: false,
                        cart: [],
                        order: [],
                        wishlist: [],
                        created_at: new Date().toISOString()
                    };
                    const res = await signup(newUser);
                    if(res.success){
                        navigator("/")
                    } else {
                        alert(res.message)
                    }
                }}
            >
                {() => (
                    <Form >
                         <div>
                            <Field name="name" placeholder="Name" className="w-full p-2 border rounded" />
                            <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
                        </div>
                        <br></br>

                        <div>
                            <Field name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" />
                            <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                        </div>
                        <br></br>

                        <div>
                            <Field name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
                            <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                        </div>
                        <br></br>

                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                            Register
                        </button>
                        
                        <div className="text-center mt-4">
                        
                        <p className="text-sm">
                            Already have an account?{" "}
                        
                        <button onClick={() => navigator("/login")} className="text-blue-600 hover:underline" >
                            Login
                        </button>
                        
                        </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    </>
    );
};

export default SignUp