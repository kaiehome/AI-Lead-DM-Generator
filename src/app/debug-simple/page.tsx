'use client'

import { useState, useEffect } from 'react'
import { useLeads } from '@/hooks/use-leads'
import { useAllMessages } from '@/hooks/use-messages'

export default function DebugSimplePage() {
  const { data: leadsData, isLoading: leadsLoading, error: leadsError } = useLeads()
  const { data: messagesData, isLoading: messagesLoading, error: messagesError } = useAllMessages()
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  useEffect(() => {
    addDebugInfo('页面加载完成')
  }, [])

  useEffect(() => {
    if (leadsLoading) {
      addDebugInfo('线索数据加载中...')
    } else if (leadsError) {
      addDebugInfo(`线索数据错误: ${leadsError.message}`)
    } else if (leadsData) {
      addDebugInfo(`线索数据加载成功: ${JSON.stringify(leadsData).substring(0, 100)}...`)
    }
  }, [leadsData, leadsLoading, leadsError])

  useEffect(() => {
    if (messagesLoading) {
      addDebugInfo('消息数据加载中...')
    } else if (messagesError) {
      addDebugInfo(`消息数据错误: ${messagesError.message}`)
    } else if (messagesData) {
      addDebugInfo(`消息数据加载成功: ${JSON.stringify(messagesData).substring(0, 100)}...`)
    }
  }, [messagesData, messagesLoading, messagesError])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">简单调试页面</h1>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">数据状态</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">线索数据</h3>
              <p>加载状态: {leadsLoading ? '加载中' : leadsError ? '错误' : '完成'}</p>
              <p>数据: {leadsData ? '有数据' : '无数据'}</p>
              {leadsData && (
                <p>线索数量: {leadsData.leads?.length || 0}</p>
              )}
            </div>
            <div>
              <h3 className="font-medium">消息数据</h3>
              <p>加载状态: {messagesLoading ? '加载中' : messagesError ? '错误' : '完成'}</p>
              <p>数据: {messagesData ? '有数据' : '无数据'}</p>
              {messagesData && (
                <p>消息数量: {messagesData.messages?.length || 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">调试日志</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {info}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 