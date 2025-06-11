import React from "react";
const User = ({ name, date }) => {
    return <>
        <div className="flex items-center">
            <div className="h-12 w-12 bg-amber-500 rounded-full flex justify-center items-center mr-3">
                {name[0].toUpperCase()}
            </div>
            <div>
                <div className="text-lg font-mono ">
                    {name}
                </div>
                <p>
                    {date}
                </p>
            </div>
        </div>
    </>
}
export default User;