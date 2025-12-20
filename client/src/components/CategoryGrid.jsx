import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryGrid = () => {
    const categoryData = useSelector(state => state.product.allCategory)
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCategory = useSelector(state => state.product.loadingCategory)
    const navigate = useNavigate()

    const handleCategoryClick = (categoryId, categoryName) => {
        // Find the first subcategory for this category
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == categoryId
            })
            return filterData ? true : null
        })

        if (subcategory) {
            const url = `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
            navigate(url)
        }
    }

    return (
        <div className='container mx-auto px-4 py-6'>
            <h2 className='text-2xl font-bold mb-4'>Shop by Categories</h2>
            {loadingCategory ? (
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {new Array(18).fill(null).map((_, index) => (
                        <div key={index} className='bg-white rounded-lg shadow-md p-4 animate-pulse'>
                            <div className='bg-gray-200 h-32 rounded mb-2'></div>
                            <div className='bg-gray-200 h-4 rounded'></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                    {categoryData?.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => handleCategoryClick(category._id, category.name)}
                            className='bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center'
                        >
                            <div className='w-full h-32 mb-3 rounded overflow-hidden bg-gray-50 flex items-center justify-center'>
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className='w-full h-full object-scale-down'
                                />
                            </div>
                            <p className='text-sm font-medium text-center text-gray-800 line-clamp-2'>
                                {category.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CategoryGrid

