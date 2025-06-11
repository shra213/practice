import React from "react";
const Heading = ({ label }) => {
    return <>
        <div className="text-2xl text-gray-300 text-center font-bold">
            {label}
        </div>
    </>
}
function Subheading({ text }) {
    return <div className="text-gray-200 text-center p-4 pr-2">
        {text}
    </div>
}
export {Heading,Subheading} ;
