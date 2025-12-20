import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import isAdmin from '../utils/isAdmin';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isAdminLogin, setIsAdminLogin] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message)
                localStorage.setItem('accesstoken', response.data.data.accesstoken)
                localStorage.setItem('refreshToken', response.data.data.refreshToken)

                const userDetails = await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))

                setData({
                    email: "",
                    password: "",
                })

                // Validate admin login attempt
                if (isAdminLogin && !isAdmin(userDetails.data.role)) {
                    toast.error("This account is not an admin. Please use regular login.")
                    setIsAdminLogin(false)
                    navigate("/")
                    return
                }

                // Redirect admins to dashboard, regular users to home
                if (isAdmin(userDetails.data.role)) {
                    navigate("/dashboard/admin-dashboard")
                    toast.success("Welcome Admin!")
                } else {
                    navigate("/")
                }
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }
    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                {/* Admin Login Toggle */}
                <div className='mb-4 pb-4 border-b'>
                    <button
                        type='button'
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${isAdminLogin
                                ? 'bg-orange-100 border-2 border-orange-500 text-orange-700'
                                : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <FaUserShield size={18} />
                        <span className='font-semibold font-["IBM_Plex_Sans"] font-medium'>
                            {isAdminLogin ? 'Admin Login Mode' : 'Regular Login'}
                        </span>
                    </button>
                    {isAdminLogin && (
                        <p className='text-sm text-orange-600 mt-2 text-center'>
                            You are logging in as an administrator
                        </p>
                    )}
                </div>

                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor='email' className='font-["IBM_Plex_Sans"] font-medium'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            className='bg-blue-50 p-2 border rounded outline-none focus:border-primary-200 font-["IBM_Plex_Sans"] font-medium'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder={isAdminLogin ? 'Enter admin email' : 'Enter your email'}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label htmlFor='password' className='font-["IBM_Plex_Sans"] font-medium'>Password :</label>
                        <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                className='w-full outline-none font-["IBM_Plex_Sans"] font-medium'
                                name='password'
                                value={data.password}
                                onChange={handleChange}
                                placeholder='Enter your password'
                            />
                            <div onClick={() => setShowPassword(preve => !preve)} className='cursor-pointer'>
                                {
                                    showPassword ? (
                                        <FaRegEye />
                                    ) : (
                                        <FaRegEyeSlash />
                                    )
                                }
                            </div>
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password ?</Link>
                    </div>

                    <button
                        disabled={!valideValue}
                        className={`${valideValue
                            ? isAdminLogin
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "bg-green-800 hover:bg-green-700"
                            : "bg-gray-500"
                            } text-white py-2 rounded font-semibold my-3 tracking-wide flex items-center justify-center gap-2 font-["IBM_Plex_Sans"] font-medium`}
                    >
                        {isAdminLogin && <FaUserShield size={16} />}
                        {isAdminLogin ? 'Login as Admin' : 'Login'}
                    </button>

                </form>

                <p>
                    Don't have account? <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>Register</Link>
                </p>
            </div>
        </section>
    )
}

export default Login

