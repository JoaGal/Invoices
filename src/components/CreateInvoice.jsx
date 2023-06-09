import React, { useState } from "react";
import { motion } from "framer-motion";
import AddItem from "./AddItem";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import invoiceSlice from "../redux/invoiceSlice";
import {
  validateSenderStreetAddress,
  validateSenderPostCode,
  validateSenderCity,
  validateCLientEmail,
  validateCLientName,
  validateClientCity,
  validateClientPostCode,
  validateClientStreetAddress,
  validateItemCount,
  validateItemName,
  validateItemPrice,
  validateSenderCountry,
  validateClientCountry,
} from "../functions/createInvoiceValidator";
import InputCreateInvoice from "./InputCreateInvoice";

function CreateInvoice({
  setOpenCreateInvoice,
  invoice,
  type,
}) {
  const dispatch = useDispatch();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);
  
  const deliveryTimes = [
    { text: "Next 1 day", value: 1 },
    { text: "Next 7 day", value: 7 },
    { text: "Next 14 day", value: 14 },
    { text: "Next 30 day", value: 30 },
  ];

  const [invoiceNew, setInvoiceNew] = useState({
    senderStreet: "",
    senderCity: "",
    senderPostCode: "",
    senderCountry: "",
    clientName: "",
    clientEmail: "",
    clientStreet: "",
    clientCity: "",
    clientPostCode: "",
    clientCountry: "",
    description: "",
    selectDeliveryDate: "",
  });

  const { senderStreet, senderCity, senderPostCode, senderCountry, clientName, clientEmail, clientStreet, clientCity, clientPostCode, clientCountry, description, selectDeliveryDate } = invoiceNew;  

  const handleChange = (e) => {
      const { name, value } = e.target;
      setInvoiceNew((prev) => ({
          ...prev,
          [name]: value,
      }));
      };

  const [paymentTerms, setpaymentTerms] = useState(deliveryTimes[0].value);

  const [item, setItem] = useState([
    {
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
      id: uuidv4(),
    },
  ]);
  const onDelete = (id) => {
    setItem((pervState) => pervState.filter((el) => el.id !== id));
  };

  const handelOnChange = (id, e) => {
    let data = [...item];

    let foundData = data.find((el) => el.id === id);

    if (e.target.name === "quantity" || "price") {
      foundData[e.target.name] = e.target.value;
      foundData["total"] = (
        Number(foundData.quantity) * Number(foundData.price)
      ).toFixed(2);
    } else {
      foundData[e.target.name] = e.target.value;
    }

    setItem(data);
  };

  const onSubmit = () => {
    if (type === "edit") {
      dispatch(
        invoiceSlice.actions.editInvoice({
          description,
          paymentTerms,
          clientName,
          clientEmail,
          senderStreet,
          senderCity,
          senderPostCode,
          senderCountry,
          clientStreet,
          clientCity,
          clientPostCode,
          clientCountry,
          item,
          id: invoice.id,
        })
      );
      setOpenCreateInvoice(false);
    } else {
      dispatch(
        invoiceSlice.actions.addInvoice({
          description,
          paymentTerms,
          clientName,
          clientEmail,
          senderStreet,
          senderCity,
          senderPostCode,
          senderCountry,
          clientStreet,
          clientCity,
          clientPostCode,
          clientCountry,
          item,
        })
      );
    }
  };

  if (type === "edit" && isFirstLoad) {
    const updatedItemsArray = invoice.items.map((obj, index) => {
      return { ...obj, id: index + 1 };
    });

    setInvoiceNew({
      senderStreet: invoice.senderAddress.street,
      senderCity: invoice.senderAddress.city,
      senderPostCode: invoice.senderAddress.postCode,
      senderCountry: invoice.senderAddress.country,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientStreet: invoice.clientAddress.street,
      clientCity: invoice.clientAddress.city,
      clientPostCode: invoice.clientAddress.postCode,
      clientCountry: invoice.clientAddress.country,
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
    })

    setItem(updatedItemsArray);

    setIsFirstLoad(false);
  }

  function itemsValidator() {
    const itemName = item.map((i) => validateItemName(i.name));
    const itemCount = item.map((i) => validateItemCount(i.quantity));
    const itemPrice = item.map((i) => validateItemPrice(i.price));

    const allItemsElement = itemCount.concat(itemPrice, itemName);

    return allItemsElement.includes(false) === true ? false : true;
  }

  function validator() {
    if (
      validateSenderStreetAddress(senderStreet) &&
      validateSenderPostCode(senderPostCode) &&
      validateSenderCity(senderCity) &&
      validateCLientEmail(clientEmail) &&
      validateCLientName(clientName) &&
      validateClientCity(clientCity) &&
      validateClientPostCode(clientPostCode) &&
      validateClientStreetAddress(clientStreet) &&
      validateSenderCountry(senderCountry) &&
      validateClientCountry(clientCountry) &&
      itemsValidator()
    ) {
      return true;
    }
    return false;
  }

  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenCreateInvoice(false);
      }}
      className="  fixed top-0 bottom-0 left-0 right-0  bg-[#000005be]"
    >
      <motion.div
        key="createInvoice-sidebar"
        initial={{ x: -500, opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 40,
            duration: 0.4,
          },
        }}
        exit={{ x: -700, transition: { duration: 0.2 } }}
        className="  scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white  md:pl-[150px] py-16 px-6 h-screen md:w-[768px] md:rounded-r-3xl"
      >
        <h1 className=" font-semibold dark:text-white text-3xl">
          {type == "edit" ? "Edit" : "Create"} Invoice
        </h1>

        <div className=" overflow-y-scroll scrollbar-hide my-14">
          <h1 className=" text-[#7c5dfa] mb-4 font-medium">Bill From</h1>

          <div className=" grid grid-cols-3 mx-1  space-y-4 ">
            <div className=" flex flex-col col-span-3">
              <InputCreateInvoice
                name="Street Address"
                functionOnChange={handleChange}
                value={senderStreet}
                validator={validateSenderStreetAddress}
                isValidatorActive={isValidatorActive}
                nameInvoice="senderStreet"
              />
            </div>

            <div className=" flex flex-col mr-4 col-span-1">
              <InputCreateInvoice
                name="City"
                functionOnChange={handleChange}
                value={senderCity}
                validator={validateSenderCity}
                isValidatorActive={isValidatorActive}
                nameInvoice="senderCity"
              />
            </div>
            <div className=" flex flex-col mr-4 col-span-1">
              <InputCreateInvoice
                name="Post Code"
                functionOnChange={handleChange}
                value={senderPostCode}
                validator={validateSenderPostCode}
                isValidatorActive={isValidatorActive}
                nameInvoice="senderPostCode"
              />
            </div>
            <div className=" flex flex-col col-span-1">
              <InputCreateInvoice
                name="Country"
                functionOnChange={handleChange}
                value={senderCountry}
                validator={validateSenderCountry}
                isValidatorActive={isValidatorActive}
                nameInvoice="senderCountry"
              />
            </div>
          </div>

          {/* Bill to Section */}

          <h1 className=" text-[#7c5dfa] my-4 mt-10 font-medium">Bill To</h1>

          <div className=" grid grid-cols-3 mx-1   space-y-4 ">
            <div className=" flex flex-col col-span-3">
              <InputCreateInvoice
                name="Client Name"
                functionOnChange={handleChange}
                value={clientName}
                validator={validateCLientName}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientName"
              />
            </div>

            <div className=" flex flex-col   col-span-3">
              <InputCreateInvoice
                name="Client Email"
                functionOnChange={handleChange}
                value={clientEmail}
                validator={validateCLientEmail}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientEmail"
              />
            </div>

            <div className=" flex flex-col col-span-3">
              <InputCreateInvoice
                name="Street Address"
                functionOnChange={handleChange}
                value={clientStreet}
                validator={validateClientStreetAddress}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientStreet"
              />
            </div>

            <div className=" flex flex-col mr-4 col-span-1">
              <InputCreateInvoice
                name="City"
                functionOnChange={handleChange}
                value={clientCity}
                validator={validateClientCity}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientCity"
              />
            </div>

            <div className=" flex flex-col mr-4 col-span-1">
              <InputCreateInvoice
                name="Post Code"
                functionOnChange={handleChange}
                value={clientPostCode}
                validator={validateClientPostCode}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientPostCode"
              />
            </div>

            <div className=" flex flex-col col-span-1">
              <InputCreateInvoice 
                name="Country"
                functionOnChange={handleChange}
                value={clientCountry}
                validator={validateClientCountry}
                isValidatorActive={isValidatorActive}
                nameInvoice="clientCountry"
                />
            </div>
          </div>

          <div className=" grid mx-1 grid-cols-2 mt-8 ">
            <div className=" flex flex-col ">
              <label className=" text-gray-400 font-light">Invoice Date</label>
              <input
                type="date"
                value={selectDeliveryDate}
                onChange={handleChange}
                className=" dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none  dark:border-gray-800 dark:text-white  mr-4"
                name="selectDeliveryDate"
              />
            </div>

            <div className=" mx-auto w-full">
              <label className=" text-gray-400 font-light">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setpaymentTerms(e.target.value)}
                className=" appearance-none w-full py-2 px-4 border-[.2px] rounded-lg focus:outline-none  dark:bg-[#1e2139] dark:text-white dark:border-gray-800  focus:outline-purple-400 border-gray-300 select-status"
                name="paymentTerms"
              >
                {deliveryTimes.map((time) => (
                  <option value={time.value}>{time.text}</option>
                ))}
              </select>
            </div>
          </div>

          <div className=" mx-1 mt-4 flex flex-col ">
            <label className=" text-gray-400 font-light">Description</label>
            <input
              name="description"
              value={description}
              onChange={handleChange}
              type="text"
              className=" dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none   focus:outline-purple-400 border-gray-300 dark:border-gray-800 dark:text-white"
            />
          </div>

          {/* Item List Section */}

          <h2 className=" text-2xl text-gray-500 mt-10 ">Item List</h2>
          {item.map((itemDetails, index) => (
            <div className=" border-b pb-2 border-gray-300 mb-4 ">
              <AddItem
                isValidatorActive={isValidatorActive}
                key={index}
                handelOnChange={handelOnChange}
                setItem={setItem}
                onDelete={onDelete}
                itemDetails={itemDetails}
              />
            </div>
          ))}

          <button
            onClick={() => {
              setItem((state) => [
                ...state,
                {
                  name: "",
                  quantity: 1,
                  price: 0,
                  total: 0,
                  id: uuidv4(),
                },
              ]);
            }}
            className=" bg-gray-200  hover:opacity-80 mx-auto py-2 items-center dark:text-white dark:bg-[#252945] justify-center rounded-xl  w-full mt-6"
          >
            + Add New Item
          </button>
        </div>

        <div className=" flex  justify-between">
          <div>
            <button
              onClick={() => {
                setOpenCreateInvoice(false);
              }}
              className=" bg-gray-200  hover:opacity-80 mx-auto py-4 items-center dark:text-white  dark:bg-[#252945] justify-center  px-8 rounded-full "
            >
              Discard
            </button>
          </div>

          <div>
            <button
              className=" text-white  hover:opacity-80 mx-auto py-4 items-center bg-[#7c5dfa] justify-center  px-8 rounded-full "
              onClick={() => {
                const isValid = validator();
                setIsValidatorActive(true);
                if (isValid) {
                  onSubmit();
                  setOpenCreateInvoice(false);
                }
              }}
            >
              Save & Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CreateInvoice;
