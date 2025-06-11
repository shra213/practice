import React from "react";
const Input = ({ label,id, onchange}) => {
    return <>
        <div className="w-full">
            <input 
                id={id}
                className=" bg-white rounded-lg p-2 pl-3 w-full m-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-800 transition duration-150"
                placeholder={label} 
                onChange={onchange}
            />
        </div>
    </>
}
export default Input;