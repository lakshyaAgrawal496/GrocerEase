import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import toast from 'react-hot-toast'
import { IoSearchOutline } from "react-icons/io5"
import { FaEdit } from "react-icons/fa"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingOrder, setEditingOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(search && { search })
      })

      const response = await Axios({
        ...SummaryApi.adminGetAllOrders,
        url: `${SummaryApi.adminGetAllOrders.url}?${queryParams.toString()}`
      })

      if (response.data.success) {
        setOrders(response.data.data)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== "" || page === 1) {
        fetchOrders()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await Axios({
        ...SummaryApi.adminUpdateOrderStatus,
        url: `${SummaryApi.adminUpdateOrderStatus.url}/${orderId}/status`,
        data: { delivery_status: newStatus }
      })

      if (response.data.success) {
        toast.success("Order status updated successfully")
        setEditingOrder(null)
        fetchOrders()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <section className='p-4 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <h2 className='text-2xl font-semibold text-gray-800'>Order Management</h2>
          
          <div className='flex flex-col md:flex-row gap-3 w-full md:w-auto '>
            {/* Search */}
            <div className='bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200 w-full md:w-64'>
              <IoSearchOutline size={20} />
              <input
                type='text'
                placeholder='Search orders...'
                className='w-full outline-none bg-transparent'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className='px-4 py-2 border rounded outline-none focus:border-primary-200'
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='bg-white shadow-md rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Order ID</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Product</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Customer</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Quantity</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Amount</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Payment</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Status</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Date</th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase'>Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className='hover:bg-gray-50'>
                        <td className='px-4 py-3 text-sm text-gray-900'>{order.orderId}</td>
                        <td className='px-4 py-3 '>
                          <div className='flex items-center gap-2'>
                            {order.product_details?.image?.[0] && (
                              <img
                                src={order.product_details.image[0]}
                                alt={order.product_details.name}
                                className='w-10 h-10 object-cover rounded'
                              />
                            )}
                            <span className='text-sm text-gray-900 font-medium'>
                              {order.product_details?.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 font-medium'>
                          {order.userId?.name || "N/A"}
                          <br />
                          <span className='text-xs text-gray-500'>{order.userId?.email || ""}</span>
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 font-medium'>{order.quantity || 1}</td>
                        <td className='px-4 py-3 text-sm font-semibold text-gray-900 font-medium'>
                          {DisplayPriceInRupees(order.totalAmt)}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-900 font-medium'>
                          <span className='text-xs'>{order.payment_status || "N/A"}</span>
                        </td>
                        <td className='px-4 py-3'>
                          {editingOrder === order._id ? (
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className='px-2 py-1 border rounded text-sm outline-none font-medium'
                              onBlur={() => {
                                if (selectedStatus && selectedStatus !== order.delivery_status) {
                                  handleStatusUpdate(order._id, selectedStatus)
                                } else {
                                  setEditingOrder(null)
                                }
                              }}
                              autoFocus
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 py-1 rounded-full font-medium text-xs font-medium ${getStatusColor(
                                order.delivery_status
                              )}`}
                            >
                              {order.delivery_status || "Pending"}
                            </span>
                          )}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-500 font-medium'>
                          {formatDate(order.createdAt)}
                        </td>
                        <td className='px-4 py-3'>
                          {editingOrder !== order._id && (
                            <button
                              onClick={() => {
                                setEditingOrder(order._id)
                                setSelectedStatus(order.delivery_status || "Pending")
                              }}
                              className='text-blue-600 hover:text-blue-800'
                            >
                              <FaEdit size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className='px-4 py-8 text-center text-gray-500'>
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-md'>
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className='px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>
              <span className='text-gray-700'>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className='px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default AdminOrders

