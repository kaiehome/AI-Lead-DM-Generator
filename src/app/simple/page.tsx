'use client'

import { useState, useEffect } from 'react'

export default function SimplePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/leads')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">简单测试页面</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">状态信息</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? '是' : '否'}</p>
            <p><strong>Error:</strong> {error || '无'}</p>
            <p><strong>Data:</strong> {data ? '有数据' : '无数据'}</p>
          </div>
        </div>

        {loading && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">正在加载数据...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800">错误: {error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">数据内容:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 