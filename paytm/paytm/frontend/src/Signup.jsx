import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heading, Subheading } from "./components/Heading";
import Input from "./components/Input";
import Logo from "./components/Logo";
import { use } from "react";
const Signup = () => {
    // const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    // const [fullname, setFullname] = useState("");
    // const [pass, setPass] = useState("");
    const [formdata, setformdata] = useState({
        username: "",
        email: "",
        fullname: "",
        password: ""
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setformdata({ ...formdata, [e.target.id]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        //axios ko json form me dtaat bhejne ke liye jarurat nhi hai vo bydefault 
        //headers ko application/json set krta haii and data bhi json format me sent krta hai
        //jaise hme fetch me specifically json.string me convert krna hota hai
        try {
            const res = await axios.post("http://localhost:3000/api/v1/user/sign_up",
                formdata
            )
            alert("form submitted")
            console.log(res);
            navigate("/login");
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="h-screen w-full flex justify-center items-center bg-[url('https://media.istockphoto.com/vectors/digital-rupee-concept-background-with-rupee-symbol-vector-id1370111769?k=20&m=1370111769&s=612x612&w=0&h=UOoysEObgAhzQUnA-9i9fUSu1fHkTSCNI8fKQ0zUJ20=')] bg-cover bg-center">
                <div className="bg-white/25 backdrop-blur-md p-8 rounded-xl shadow-4xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <Logo />
                    <Heading label={"Sign Up"} />
                    <form onSubmit={handleSubmit}>
                        <div className="m-3">
                            <div className="grid grid-cols-2 gap-2">
                                <Input label={"Username"} id={"username"} onchange={handleChange} />
                                <Input label={"Email"} id={"email"} onchange={handleChange} />
                            </div>
                            <Input label={"Full Name"} id={"fullname"} onchange={handleChange} />
                            <Input label={"Password"} id={"password"} onchange={handleChange} />
                        </div>
                        <div className="flex justify-center item-center">
                            <Subheading text={"Already have an account ??"} />
                            <p className="pt-4 font-semibold text-white">
                               <Link to={"/login"}>Login</Link> 
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 font-semibold text-md text-white text-center w-full p-1.5 m-2 rounded-2xl active:scale-95 trannsition duration-200"
                        >
                            Sign Up
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default Signup;
