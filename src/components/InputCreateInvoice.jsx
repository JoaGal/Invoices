import React from "react";

function InputCreateInvoice({name, functionOnChange, value, validator, isValidatorActive, nameInvoice} ) {
  return (
    <>
      <label className=" text-gray-400 font-light">{name}</label>
      <input
        type="text"
        value={value}
        name={nameInvoice}
        onChange={functionOnChange}
        className={` dark:bg-[#1e2139] py-2 px-4 border-[.2px] focus:outline-none  rounded-lg  focus:outline-purple-400 ${
          isValidatorActive &&
          !validator(value) &&
          "border-red-500 dark:border-red-500 outline-red-500 border-2"
        } border-gray-300 dark:border-gray-800`}
      />
    </>
  );
}

export default InputCreateInvoice;
