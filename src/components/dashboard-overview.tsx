'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Target, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MousePointer,
  Heart
} from 'lucide-react'

interface DashboardOverviewProps {
  totalLeads: number
  totalMessages: number
  approvedMessages: number
  sentMessages: number
  isLoading?: boolean
}

export function DashboardOverview({ 
  totalLeads, 
  totalMessages, 
  approvedMessages, 
  sentMessages,
  isLoading = false 
}: DashboardOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  // 模拟数据
  const conversionRate = totalLeads > 0 ? Math.round((sentMessages / totalLeads) * 100) : 0
  const approvalRate = totalMessages > 0 ? Math.round((approvedMessages / totalMessages) * 100) : 0
  const avgResponseTime = 2.4
  const engagementRate = 68

  const metrics = [
    {
      title: '转化率',
      value: `${conversionRate}%`,
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '平均响应时间',
      value: `${avgResponseTime}h`,
      change: '-0.5h',
      trend: 'down',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '消息批准率',
      value: `${approvalRate}%`,
      change: '+8%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '参与度',
      value: `${engagementRate}%`,
      change: '+5%',
      trend: 'up',
      icon: Heart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const recentActivity = [
    {
      type: 'message_sent',
      title: '消息已发送',
      description: '向 John Doe 发送了连接请求',
      time: '2分钟前',
      status: 'success'
    },
    {
      type: 'lead_added',
      title: '新线索添加',
      description: '添加了 Sarah Johnson 作为新线索',
      time: '15分钟前',
      status: 'info'
    },
    {
      type: 'message_approved',
      title: '消息已批准',
      description: 'AI生成的消息已获得批准',
      time: '1小时前',
      status: 'success'
    },
    {
      type: 'lead_updated',
      title: '线索信息更新',
      description: '更新了 Mike Wilson 的公司信息',
      time: '2小时前',
      status: 'warning'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'info':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'warning':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
    }
  }

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">数据分析</h2>
          <p className="text-gray-600">查看您的销售线索和消息生成数据</p>
        </div>
        <div className="flex items-center space-x-2">
          {['7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === '7d' ? '7天' : period === '30d' ? '30天' : '90天'}
            </Button>
          ))}
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="card-modern hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center space-x-1 text-sm">
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                <span className="text-gray-500">vs 上期</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 详细分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 转化漏斗 */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span>转化漏斗</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">总线索数</span>
                <span className="text-sm text-gray-600">{totalLeads}</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">消息生成</span>
                <span className="text-sm text-gray-600">{totalMessages}</span>
              </div>
              <Progress value={totalLeads > 0 ? (totalMessages / totalLeads) * 100 : 0} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">消息批准</span>
                <span className="text-sm text-gray-600">{approvedMessages}</span>
              </div>
              <Progress value={totalMessages > 0 ? (approvedMessages / totalMessages) * 100 : 0} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">消息发送</span>
                <span className="text-sm text-gray-600">{sentMessages}</span>
              </div>
              <Progress value={approvedMessages > 0 ? (sentMessages / approvedMessages) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>最近活动</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 性能趋势 */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>性能趋势</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>图表功能即将推出</p>
              <p className="text-sm">这里将显示详细的性能趋势图表</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 