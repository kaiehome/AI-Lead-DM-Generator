'use client'

import { useLeads } from '@/hooks/use-leads'

export default function DebugPage() {
  const { data, isLoading, error } = useLeads()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">调试页面</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">状态信息</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {isLoading ? '是' : '否'}</p>
            <p><strong>Error:</strong> {error ? error.message : '无'}</p>
            <p><strong>Data:</strong> {data ? '有数据' : '无数据'}</p>
          </div>
        </div>

        {isLoading && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">正在加载数据...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-800">错误: {error.message}</p>
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