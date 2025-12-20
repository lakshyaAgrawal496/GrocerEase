import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { 
  FaBox, 
  FaRupeeSign, 
  FaShoppingCart, 
  FaUsers, 
  FaCheckCircle, 
  FaClock, 
  FaTruck, 
  FaTimesCircle 
} from 'react-icons/fa'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [topProducts, setTopProducts] = useState([])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const [statsResponse, topProductsResponse] = await Promise.all([
        Axios({ ...SummaryApi.adminGetDashboardStats }),
        Axios({ 
          ...SummaryApi.adminGetTopProducts, 
          url: `${SummaryApi.adminGetTopProducts.url}?limit=5` 
        })
      ])

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data)
      }

      if (topProductsResponse.data.success) {
        setTopProducts(topProductsResponse.data.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (!stats) {
    return (
      <div className='p-4 text-center text-red-600'>
        Failed to load dashboard stats
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: DisplayPriceInRupees(stats.totalRevenue),
      icon: <FaRupeeSign size={24} />,
      color: 'bg-green-500',
      link: '/dashboard/orders'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FaShoppingCart size={24} />,
      color: 'bg-blue-500',
      link: '/dashboard/orders'
    },
    {
      title: 'Delivered Orders',
      value: stats.totalDelivered,
      icon: <FaCheckCircle size={24} />,
      color: 'bg-green-600',
      link: '/dashboard/orders?status=Delivered'
    },
    {
      title: 'Total Products Sold',
      value: stats.totalProductsSold,
      icon: <FaBox size={24} />,
      color: 'bg-purple-500',
      link: '/dashboard/product'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <FaBox size={24} />,
      color: 'bg-indigo-500',
      link: '/dashboard/product'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers size={24} />,
      color: 'bg-pink-500',
      link: '/dashboard'
    }
  ]

  const statusCards = [
    {
      title: 'Pending',
      value: stats.ordersByStatus.pending,
      icon: <FaClock size={20} />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    {
      title: 'Shipped',
      value: stats.ordersByStatus.shipped,
      icon: <FaTruck size={20} />,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'Delivered',
      value: stats.ordersByStatus.delivered,
      icon: <FaCheckCircle size={20} />,
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      title: 'Cancelled',
      value: stats.ordersByStatus.cancelled,
      icon: <FaTimesCircle size={20} />,
      color: 'bg-red-100 text-red-800 border-red-300'
    }
  ]

  return (
    <section className='p-4 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Admin Dashboard</h1>
        <p className='text-gray-600 mt-1'>Overview of your e-commerce platform</p>
      </div>

      {/* Main Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm mb-1'>{card.title}</p>
                <p className='text-2xl font-bold text-gray-800'>{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-4 rounded-full`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Order Status Breakdown */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Order Status</h2>
          <div className='grid grid-cols-2 gap-4'>
            {statusCards.map((status, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${status.color}`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium'>{status.title}</p>
                    <p className='text-2xl font-bold mt-1'>{status.value}</p>
                  </div>
                  {status.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className='space-y-3'>
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-lg font-bold text-gray-500'>#{index + 1}</span>
                    {product.productImage && (
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className='w-12 h-12 object-cover rounded'
                      />
                    )}
                    <div>
                      <p className='font-semibold text-gray-800'>
                        {product.productName || 'Unknown Product'}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {product.totalQuantity} sold
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-green-600'>
                      {DisplayPriceInRupees(product.totalRevenue)}
                    </p>
                    <p className='text-xs text-gray-500'>{product.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-8'>No sales data available</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-6 bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Link
            to='/dashboard/product'
            className='bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center font-semibold transition-colors'
          >
            Manage Products
          </Link>
          <Link
            to='/dashboard/orders'
            className='bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center font-semibold transition-colors'
          >
            View Orders
          </Link>
          <Link
            to='/dashboard/upload-product'
            className='bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center font-semibold transition-colors'
          >
            Add Product
          </Link>
          <Link
            to='/dashboard/orders?status=Pending'
            className='bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center font-semibold transition-colors'
          >
            Pending Orders
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard

