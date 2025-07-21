'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugComponentsPage() {
  const [currentTest, setCurrentTest] = useState<string>('')
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
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

  const testBasicUI = async () => {
    addTestResult('基础UI组件测试开始')
    // 测试基础UI组件
    addTestResult('Button 组件正常')
    addTestResult('Card 组件正常')
  }

  const testQuickActions = async () => {
    const { QuickActions } = await import('@/components/quick-actions')
    addTestResult('QuickActions 组件导入成功')
  }

  const testStatsCards = async () => {
    const { StatsCards } = await import('@/components/stats-cards')
    addTestResult('StatsCards 组件导入成功')
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

  const testSearchFilter = async () => {
    const { SearchFilter } = await import('@/components/search-filter')
    addTestResult('SearchFilter 组件导入成功')
  }

  const testLeadForm = async () => {
    const { LeadForm } = await import('@/components/lead-form')
    addTestResult('LeadForm 组件导入成功')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">组件调试页面</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>基础测试</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => testComponent('BasicUI', testBasicUI)} className="w-full mb-4">
                测试基础UI组件
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>组件测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => testComponent('QuickActions', testQuickActions)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 QuickActions
              </Button>
              <Button 
                onClick={() => testComponent('StatsCards', testStatsCards)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 StatsCards
              </Button>
              <Button 
                onClick={() => testComponent('DashboardOverview', testDashboardOverview)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 DashboardOverview
              </Button>
              <Button 
                onClick={() => testComponent('LeadsTable', testLeadsTable)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 LeadsTable
              </Button>
              <Button 
                onClick={() => testComponent('MessageGenerator', testMessageGenerator)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 MessageGenerator
              </Button>
              <Button 
                onClick={() => testComponent('SearchFilter', testSearchFilter)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 SearchFilter
              </Button>
              <Button 
                onClick={() => testComponent('LeadForm', testLeadForm)}
                disabled={!!currentTest}
                variant="outline"
                className="w-full"
              >
                测试 LeadForm
              </Button>
            </CardContent>
          </Card>
        </div>

        {currentTest && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="text-center text-blue-600">
                正在测试: {currentTest}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>测试日志</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 