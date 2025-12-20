import React, { useMemo, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import AddressMap from '../components/AddressMap'
import qr from '../../../images/qr.jpg'

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const [resolvedAddress,setResolvedAddress] = useState(null)
  const [showOnlineUPI,setShowOnlineUPI] = useState(false)
  const [upiRef,setUpiRef] = useState("")
  const addressList = useSelector(state => state.addresses.addressList)
  const [selectAddress, setSelectAddress] = useState(0)
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  const selectedAddressData = addressList?.[selectAddress]

  const formattedSelectedAddress = useMemo(() => {
    if (!selectedAddressData) return ''
    const { address_line, city, state, country, pincode } = selectedAddressData
    return [address_line, city, state, country, pincode].filter(Boolean).join(', ')
  }, [selectedAddressData])

  const handleCashOnDelivery = async() => {
      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem){
                fetchCartItem()
              }
              if(fetchOrder){
                fetchOrder()
              }
              navigate('/order-tracking/demo123')
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

  const handleOnlinePayment = ()=>{
    setShowOnlineUPI(true)
  }

  const handleVerifyUPIPayment = async()=>{
    try{
      const response = await Axios({
        ...SummaryApi.verifyUpiPayment,
        data : {
          list_items : cartItemsList,
          addressId : addressList[selectAddress]?._id,
          subTotalAmt : totalPrice,
          totalAmt : totalPrice,
          upi_reference : upiRef
        }
      })

      const { data : responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchCartItem){
          fetchCartItem()
        }
        if(fetchOrder){
          fetchOrder()
        }
        navigate('/order-tracking/demo123')
      }
    }catch(error){
      AxiosToastError(error)
    }
  }
  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              addressList.map((address, index) => {
                return (
                  <label htmlFor={"address" + index} className={!address.status && "hidden"} key={address._id}>
                    <div className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${selectAddress === index ? 'border-green-500 bg-green-50' : ''}`}>
                      <div>
                        <input
                          id={"address" + index}
                          type='radio'
                          value={index}
                          checked={selectAddress === index}
                          onChange={(e) => setSelectAddress(Number(e.target.value))}
                          name='address'
                        />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
          <div className='mt-6'>
            {
              !openAddress && (
                <AddressMap 
                  selectedAddress={formattedSelectedAddress}
                  onResolved={(addr)=>{
                    setResolvedAddress(addr)
                    setOpenAddress(true)
                  }}
                />
              )
            }
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/**summary**/}
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-500'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quntity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p >Grand total</p>
              <p>{DisplayPriceInRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>
            <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>

          {
            showOnlineUPI && (
              <div className='mt-4 border rounded p-4 bg-gray-50'>
                <h3 className='text-lg font-semibold mb-1'>Pay via UPI</h3>
                <p className='text-sm text-neutral-600 mb-3'>Scan the QR with any UPI app and enter the UTR/reference after payment.</p>
                <div className='w-full border rounded bg-white flex items-center justify-center overflow-hidden'>
                  <img src={qr} alt='UPI QR' className='w-full h-full object-contain max-h-80' />
                </div>
                <div className='mt-3 grid gap-2'>
                  <label className='text-sm'>UPI reference / UTR</label>
                  <input value={upiRef} onChange={(e)=>setUpiRef(e.target.value)} placeholder='Enter UPI reference' className='border rounded px-3 py-2 text-sm' />
                  {
                    upiRef && (upiRef.replace(/\s/g,'').length < 10 || !/[0-9]/.test(upiRef)) && (
                      <p className='text-xs text-red-600'>Enter a valid reference (10–35 chars, includes numbers).</p>
                    )
                  }
                </div>
                <div className='mt-3 flex items-center justify-end gap-3'>
                  <button className='px-4 py-2 border rounded' onClick={()=>setShowOnlineUPI(false)}>Hide</button>
                  <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700' onClick={handleVerifyUPIPayment} disabled={!upiRef || upiRef.replace(/\s/g,'').length < 10}>Confirm UPI Payment</button>
                </div>
                <p className='text-xs text-neutral-600 mt-2'>If verification fails, your order will be marked pending for manual confirmation.</p>
              </div>
            )
          }
        </div>
      </div>


      {openAddress && (
        <AddAddress close={() => setOpenAddress(false)} initialValues={resolvedAddress} />
      )}
      
    </section>
  )
}

export default CheckoutPage
