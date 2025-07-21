'use client'

import { useLeads } from '@/hooks/use-leads'

export default function TestHooksPage() {
  const { data, isLoading, error } = useLeads()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Hook 测试页面</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">useLeads Hook 状态</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Loading 状态:</p>
              <p className="font-semibold">{isLoading ? '是' : '否'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Error 状态:</p>
              <p className="font-semibold text-red-600">
                {error ? error.message : '无错误'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">数据状态:</p>
              <p className="font-semibold">
                {data ? `有数据 (${data.length} 条记录)` : '无数据'}
              </p>
            </div>
            
            {data && data.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">第一条记录:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(data[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 