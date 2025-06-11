import React from "react";
import axios from "axios";
import {RecoilRoot, atom, useSetRecoilState, useRecoilValue} from 'recoil';
import { useState } from "react";
import { tokenAtom } from "./atom";
import { Heading, Subheading } from "./components/Heading";
import Input from "./components/Input";
import { useNavigate } from "react-router-dom";
import Logo from "./components/Logo";
const Login = () => {
    const settoken = useSetRecoilState(tokenAtom);
    const navigate = useNavigate();
    const [formdata, setformdata] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setformdata({...formdata, [e.target.id] :
             e.target.value})
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        console.log(formdata);
        try{
            const res = await axios.post("http://localhost:3000/api/v1/user/login",
                formdata,
                {
                    withCredentials:true,
                }
            )
            console.log(res.data);
            console.log(res.data.accessToken);
            settoken(res.data.accessToken);
            sessionStorage.setItem("access",res.data.accessToken)
            alert("login successfull");
            navigate("/Dashboard");
        }catch(error){
            console.log(error);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="h-screen w-full flex justify-center items-center bg-[url('https://media.istockphoto.com/vectors/digital-rupee-concept-background-with-rupee-symbol-vector-id1370111769?k=20&m=1370111769&s=612x612&w=0&h=UOoysEObgAhzQUnA-9i9fUSu1fHkTSCNI8fKQ0zUJ20=')] bg-cover bg-center">
                    <div className="bg-white/25 backdrop-blur-md p-8 rounded-xl shadow-4xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                        <Logo />
                        <Heading label={"Login"} />
                        <Subheading text = {"welcome to giopoint, earn your points and reedemb and get rewards"}/>
                        <div className="m-3">
                            <div className="">
                                <Input label={"Username or Email"} id = {"email"} onchange = {handleChange}/>
                                {/* <Input label={"Email"} /> */}
                            </div>
                            <Input label={"Password"} id = {"password"} onchange = {handleChange}/>
                        </div>
                        <div className="flex justify-center item-center">
                            <Subheading text={"Create an Account ?"} />
                            <p className="pt-4 font-semibold text-white">
                                Sign Up
                            </p>
                        </div>
                        <button type="submit" className="bg-blue-600 font-semibold text-md text-white text-center w-full p-1.5 m-2 rounded-2xl active:scale-95 trannsition duration-150">Login</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Login;
