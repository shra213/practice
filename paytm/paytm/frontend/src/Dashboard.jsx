import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import tokenAtom from "./atom"
import axios from "axios";
import { useRecoilState } from "recoil";
import Logo from "./components/Logo";
import User from "./components/User";
import Input from "./components/Input"
import { Heading } from "./components/Heading"
import { useEffect } from "react";
const Dashboard = () => {
    const [token, settoken] = useRecoilState(tokenAtom);
    const [user, setUser] = useState({});
    const [bal, setbal] = useState(0);
    const [users, setUsers] = useState([]);
    const [amount, setamount] = useState(0);
    const [filtered, setfiltered] = useState(users);
    const [filter, setfilter] = useState("");
    const [display, setdisplay] = useState({
        bool: false,
        totransfer: {}
    });
    useEffect(() => {
        console.log(token);
        const validate = async () => {
            // console.log("token in dash", token);
            try {
                const res = await axios.get("http://localhost:3000/api/v1/user/tokenvalid", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                // console.log(res.data.user);
                setUser(res.data.user);
                // console.log("valid");
            } catch (error) {
                // console.log("Token Valid:", res.data.message);
                // if (res.status !== 200 || !res.data) {
                console.log("accesstoken is missing");
                // console.log("access token expired");
                try {
                    const response = await axios.get("http://localhost:3000/api/v1/user/refresh", {
                        withCredentials: true
                    });
                    // console.log("Refresh success:", response.data);
                    settoken(response.data.accessToken);
                    console.log(token);
                    sessionStorage.setItem("access", response.data.accesstoken);
                } catch {
                    throw new Error("plz login again");
                }
            }
        }
        validate();
    }, [token, settoken]);
    useEffect(() => {
        const checkbal = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/v1/account/checkbal", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                setbal(res.data.balance);
            } catch {
                console.log("error in fetching balance");
            }
        }
        checkbal();
    }, [bal, token]);

    useEffect(() => {
        const getUSers = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/v1/user/getUsers", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                setUsers(res.data.newUsers);
            } catch (error) {
                console.log("error in fetching users");
            }
        }
        getUSers();
    }, [token]);

    const handleTransfer = async () => {
        try {
            console.log(token);
            const res = await axios.post("http://localhost:3000/api/v1/account/transfer",
                {
                    userId: display.totransfer._id,
                    amount: amount
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )
            console.log("transfer successfull");
            alert(`${amount} debited`)
            setdisplay(false);
            setbal();
        } catch (error) {
            console.log(error.message);
        }
    }

    const sortUsers = () => {
        setfiltered(users.filter((user) => user.fullname.includes(filter)))
    }

    useMemo(()=>{
        sortUsers();
    },[users,filter]);
    return <>
        <section>
            <div className="flex justify-center w-full rounded-b-full shadow-md shadow-blue-200 transition-shadow hover:shadow-lg hover:shadow-blue-200">
                <div className="flex justify-between items-center min-w-8/10 ">
                    <Logo />
                    <div className="flex items-center ">
                        <p className="mr-2 text-lg">Hello</p>
                        <div className="h-10 w-10 bg-amber-500 rounded-full flex justify-center items-center text-white font-semibold text-lg">
                            {user?.fullname?.[0]?.toUpperCase() || "?"}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* Balance Section */}
        <div className="grid grid-cols-4 gap-3 m-6 mt-1.5">
            <section className="sm:col-span-3 col-span-4 mt-6">
                <div className="bg-white shadow-md rounded-xl p-6 w-full ">
                    <h2 className="text-2xl font-semibold mb-4">Users</h2>
                    <div className="">
                        <input
                            type="text"
                            onChange={(e) => {
                                setfilter(e.target.value);
                            }}
                            placeholder="Search user by name or email"
                            className="col-span-7 w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    {filtered.map((user, index) => (
                        <>
                            <div id={index} className="flex justify-between itmes-center mb-4">
                                {/* {console.log(users)} */}
                                <User name={user.fullname} date={"21/9/2005"} />
                                <div className="flex items-center">
                                    <button onClick={() => {
                                        setdisplay({
                                            bool: true,
                                            totransfer: user
                                        })
                                        { console.log(display.totransfer) }
                                    }} className="bg-blue-500 h-3/4 text-white rounded-lg px-3 py-1.5 hover:bg-blue-600">
                                        Send money
                                    </button>
                                    {console.log("filteredArray1" + filtered)}
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </section>
            <section className="col-span-4 md:col-span-1 flex mt-6">
                <div className="bg-white shadow-md rounded-xl p-6 w-full text-center">
                    <h2 className="text-2xl font-semibold mb-2">Your Balance</h2>
                    <p className="text-3xl font-bold text-green-600">₹{bal}</p>
                    {display.bool && (
                        <div className="mt-6 rounded-3xl bg-green-400 border shadow-2xl shadow-amber-500 p-6 space-y-4">
                            <Heading label={"Send Money"} />

                            <div className="text-white font-semibold flex justify-start p-1 text-xl">{display.totransfer.fullname}</div>

                            <div className="flex items-center">
                                <input
                                    onChange={(e) => {
                                        setamount(e.target.value);
                                        // console.log(amount);
                                    }}
                                    placeholder="Enter Amount"
                                    className="bg-amber-50 p-2 rounded-2xl pl-4 w-full outline-none mr-1.5"
                                />

                                <button onClick={handleTransfer} className="bg-amber-500 text-white font-semibold py-2 px-6 rounded-xl hover:bg-amber-600 transition">
                                    Pay
                                </button>
                            </div>
                        </div>
                    )}


                </div>
            </section>
        </div>


        {/* Send Money Section */}

    </>
}
export default Dashboard;