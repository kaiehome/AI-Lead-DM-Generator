'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Send,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Zap,
  Star,
  AlertCircle,
  DollarSign,
  Globe,
  Building,
  MapPin
} from 'lucide-react'

interface StatsCardsProps {
  totalLeads: number
  totalMessages: number
  approvedMessages: number
  sentMessages: number
  conversionRate?: number
  avgResponseTime?: number
  topIndustries?: Array<{ name: string; count: number }>
  recentActivity?: Array<{ type: string; description: string; time: string }>
  isLoading?: boolean
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  trendValue?: number
  color: string
  isLoading?: boolean
  onClick?: () => void
  subtitle?: string
  badge?: string
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue = 0,
  color, 
  isLoading = false,
  onClick,
  subtitle,
  badge
}: StatCardProps) => (
  <Card 
    className={`card-modern group hover:shadow-medium transition-all duration-300 cursor-pointer ${onClick ? 'hover:scale-105' : ''}`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center space-x-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
      </div>
      <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="space-y-2">
          <div className="loading-pulse h-8 w-20 rounded"></div>
          <div className="loading-pulse h-4 w-16 rounded"></div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
          {trend && (
            <div className="flex items-center space-x-1">
              {trendValue >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`text-xs ${trendValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
            </div>
          )}
        </div>
      )}
    </CardContent>
  </Card>
)

const MiniChart = ({ data, color }: { data: number[], color: string }) => (
  <div className="flex items-end space-x-1 h-8">
    {data.map((value, index) => (
      <div
        key={index}
        className={`${color} rounded-sm transition-all duration-300 hover:scale-110`}
        style={{
          width: '4px',
          height: `${Math.max(4, (value / Math.max(...data)) * 24)}px`
        }}
      />
    ))}
  </div>
)

export function StatsCards({ 
  totalLeads, 
  totalMessages, 
  approvedMessages, 
  sentMessages,
  conversionRate = 0,
  avgResponseTime = 0,
  topIndustries = [],
  recentActivity = [],
  isLoading = false 
}: StatsCardsProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const stats = [
    {
      title: '总线索数',
      value: totalLeads,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: '+12%',
      trendValue: 12,
      subtitle: '活跃线索管理',
      badge: '实时',
      chartData: [12, 19, 15, 25, 22, 30, 28]
    },
    {
      title: '生成消息',
      value: totalMessages,
      icon: MessageSquare,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: '+8%',
      trendValue: 8,
      subtitle: 'AI生成的消息',
      chartData: [8, 12, 10, 18, 15, 22, 20]
    },
    {
      title: '已批准',
      value: approvedMessages,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: '+15%',
      trendValue: 15,
      subtitle: '通过审核的消息',
      chartData: [5, 8, 6, 12, 10, 15, 13]
    },
    {
      title: '已发送',
      value: sentMessages,
      icon: Send,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      trend: '+22%',
      trendValue: 22,
      subtitle: '成功发送的消息',
      chartData: [3, 6, 4, 9, 7, 12, 10]
    }
  ]

  const performanceMetrics = [
    {
      title: '转化率',
      value: `${conversionRate}%`,
      icon: Target,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      trend: '+5%',
      trendValue: 5,
      subtitle: '线索到客户转化'
    },
    {
      title: '平均响应时间',
      value: `${avgResponseTime}h`,
      icon: Clock,
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      trend: '-2h',
      trendValue: -2,
      subtitle: '消息响应速度'
    }
  ]

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(metric)
    // 这里可以打开详细分析模态框
    console.log(`查看 ${metric} 详细数据`)
  }

  return (
    <div className="space-y-6 mb-8">
      {/* 主要统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
              color={stat.color}
              subtitle={stat.subtitle}
              badge={stat.badge}
              isLoading={isLoading}
              onClick={() => handleMetricClick(stat.title)}
            />
            {/* 迷你图表 */}
            {!isLoading && (
              <div className="mt-3 flex items-center justify-between">
                <MiniChart data={stat.chartData} color={stat.color.split(' ')[1]} />
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 详细分析标签页 */}
      <Card className="card-modern">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              详细分析
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                概览
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                性能
              </TabsTrigger>
              <TabsTrigger value="industries" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                行业
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                活动
              </TabsTrigger>
            </TabsList>

            {/* 概览标签页 */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">关键指标</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Zap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">消息生成效率</p>
                          <p className="text-xs text-muted-foreground">平均每条消息生成时间</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">2.3s</p>
                        <p className="text-xs text-green-600">-0.5s</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Star className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">消息质量评分</p>
                          <p className="text-xs text-muted-foreground">基于用户反馈</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">4.8/5</p>
                        <p className="text-xs text-green-600">+0.2</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">本周趋势</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">线索增长</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">消息发送</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">转化率</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 性能标签页 */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={metric.title} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <StatCard
                      title={metric.title}
                      value={metric.value}
                      icon={metric.icon}
                      trend={metric.trend}
                      trendValue={metric.trendValue}
                      color={metric.color}
                      subtitle={metric.subtitle}
                      isLoading={isLoading}
                      onClick={() => handleMetricClick(metric.title)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 行业标签页 */}
            <TabsContent value="industries" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">热门行业</h3>
                  <div className="space-y-3">
                    {topIndustries.slice(0, 5).map((industry, index) => (
                      <div key={industry.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">{industry.name}</span>
                        </div>
                        <Badge variant="secondary">{industry.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">地理分布</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">北京</span>
                      </div>
                      <Badge variant="secondary">45%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">上海</span>
                      </div>
                      <Badge variant="secondary">32%</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <MapPin className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium">深圳</span>
                      </div>
                      <Badge variant="secondary">23%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 活动标签页 */}
            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">最近活动</h3>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>暂无最近活动</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// 简化的统计卡片，用于移动端
export function StatsCardsMobile({ 
  totalLeads, 
  totalMessages, 
  approvedMessages, 
  sentMessages,
  conversionRate = 0,
  avgResponseTime = 0,
  isLoading = false 
}: StatsCardsProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">总线索</p>
            <p className="text-xl font-bold">{isLoading ? '...' : totalLeads}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          +12%
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <MessageSquare className="h-5 w-5 mx-auto mb-1 text-purple-500" />
          <p className="text-xs text-muted-foreground">消息</p>
          <p className="font-semibold">{isLoading ? '...' : totalMessages}</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-500" />
          <p className="text-xs text-muted-foreground">已批准</p>
          <p className="font-semibold">{isLoading ? '...' : approvedMessages}</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <Send className="h-5 w-5 mx-auto mb-1 text-orange-500" />
          <p className="text-xs text-muted-foreground">已发送</p>
          <p className="font-semibold">{isLoading ? '...' : sentMessages}</p>
        </div>
      </div>

      {/* 移动端性能指标 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <Target className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
          <p className="text-xs text-muted-foreground">转化率</p>
          <p className="font-semibold">{isLoading ? '...' : `${conversionRate}%`}</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
          <Clock className="h-5 w-5 mx-auto mb-1 text-indigo-500" />
          <p className="text-xs text-muted-foreground">响应时间</p>
          <p className="font-semibold">{isLoading ? '...' : `${avgResponseTime}h`}</p>
        </div>
      </div>
    </div>
  )
} 