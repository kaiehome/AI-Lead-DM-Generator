'use client'

import { useState, useEffect } from 'react'
import { useLeads } from '@/hooks/use-leads'
import { useAllMessages } from '@/hooks/use-messages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export default function TestPage() {
  const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeads()
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useAllMessages()
  const { toast } = useToast()
  const [testResults, setTestResults] = useState<string[]>([])
  const [currentTest, setCurrentTest] = useState<string>('')

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  useEffect(() => {
    addTestResult('页面加载完成')
  }, [])

  useEffect(() => {
    if (leadsLoading) {
      addTestResult('线索数据加载中...')
    } else if (leadsError) {
      addTestResult(`线索数据加载失败: ${leadsError.message}`)
    } else if (leads) {
      addTestResult(`线索数据加载成功，共 ${leads.length} 条`)
    }
  }, [leads, leadsLoading, leadsError])

  useEffect(() => {
    if (messagesLoading) {
      addTestResult('消息数据加载中...')
    } else if (messagesError) {
      addTestResult(`消息数据加载失败: ${messagesError.message}`)
    } else if (messages) {
      addTestResult(`消息数据加载成功，共 ${messages.length} 条`)
    }
  }, [messages, messagesLoading, messagesError])

  const testToast = () => {
    toast({
      title: "测试成功",
      description: "Toast通知功能正常工作",
      variant: "success",
    })
    addTestResult('Toast通知测试成功')
  }

  const testAPI = async () => {
    try {
      const leadsResponse = await fetch('/api/leads')
      const messagesResponse = await fetch('/api/messages')
      
      if (leadsResponse.ok && messagesResponse.ok) {
        addTestResult('API测试成功')
      } else {
        addTestResult('API测试失败')
      }
    } catch (error) {
      addTestResult(`API测试错误: ${error}`)
    }
  }

  const testComponent = async (componentName: string, testFn: () => Promise<void>) => {
    setCurrentTest(componentName)
    addTestResult(`开始测试 ${componentName}...`)
    try {
      await testFn()
      addTestResult(`${componentName} 测试成功`)
    } catch (error) {
      addTestResult(`${componentName} 测试失败: ${error}`)
    }
    setCurrentTest('')
  }

  const testQuickActions = async () => {
    // 动态导入组件进行测试
    const { QuickActions } = await import('@/components/quick-actions')
    addTestResult('QuickActions 组件导入成功')
  }

  const testDashboardOverview = async () => {
    const { DashboardOverview } = await import('@/components/dashboard-overview')
    addTestResult('DashboardOverview 组件导入成功')
  }

  const testLeadsTable = async () => {
    const { LeadsTable } = await import('@/components/leads-table')
    addTestResult('LeadsTable 组件导入成功')
  }

  const testMessageGenerator = async () => {
    const { MessageGenerator } = await import('@/components/message-generator')
    addTestResult('MessageGenerator 组件导入成功')
  }

  const testStatsCards = async () => {
    const { StatsCards } = await import('@/components/stats-cards')
    addTestResult('StatsCards 组件导入成功')
  }

  const testSearchFilter = async () => {
    const { SearchFilter } = await import('@/components/search-filter')
    addTestResult('SearchFilter 组件导入成功')
  }

  const testLeadForm = async () => {
    const { LeadForm } = await import('@/components/lead-form')
    addTestResult('LeadForm 组件导入成功')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">组件功能测试页面</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基础功能测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testToast} className="w-full">
                测试Toast通知
              </Button>
              <Button onClick={testAPI} className="w-full">
                测试API
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>数据状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>线索加载状态: {leadsLoading ? '加载中' : leadsError ? '错误' : '完成'}</p>
                <p>消息加载状态: {messagesLoading ? '加载中' : messagesError ? '错误' : '完成'}</p>
                <p>线索数量: {leads?.length || 0}</p>
                <p>消息数量: {messages?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>组件测试</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => testComponent('QuickActions', testQuickActions)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 QuickActions
              </Button>
              <Button 
                onClick={() => testComponent('DashboardOverview', testDashboardOverview)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 DashboardOverview
              </Button>
              <Button 
                onClick={() => testComponent('LeadsTable', testLeadsTable)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 LeadsTable
              </Button>
              <Button 
                onClick={() => testComponent('MessageGenerator', testMessageGenerator)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 MessageGenerator
              </Button>
              <Button 
                onClick={() => testComponent('StatsCards', testStatsCards)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 StatsCards
              </Button>
              <Button 
                onClick={() => testComponent('SearchFilter', testSearchFilter)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 SearchFilter
              </Button>
              <Button 
                onClick={() => testComponent('LeadForm', testLeadForm)}
                disabled={!!currentTest}
                variant="outline"
              >
                测试 LeadForm
              </Button>
            </div>
            {currentTest && (
              <div className="mt-4 p-2 bg-blue-100 rounded text-center">
                正在测试: {currentTest}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>测试日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Toaster />
    </div>
  )
} 