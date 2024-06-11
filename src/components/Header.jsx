import React from 'react';


const Header = () => {
    return (
        <div className='bg-slate-500 w-100 h-12 p-3 border-b bordered-box flex flex-row justify-between border-b-[#9fadbc29]'>
            <div className="left justify-center items-center flex gap-3">
                <img src="./image.png" className="h-8 w-8" alt="logo" />
                <h3 className='text-slate-50 font-bold text-2xl'>PLANMASTER</h3>
            </div>
        </div>
    );
}

export default Header;