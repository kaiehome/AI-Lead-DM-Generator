'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Upload, 
  Download, 
  Sparkles, 
  Users, 
  MessageSquare,
  Settings,
  BarChart3,
  Zap,
  Target,
  Clock,
  TrendingUp
} from 'lucide-react'
import { CSVImport } from './csv-import'
import { exportLeadsToCSV, exportMessagesToCSV, formatLeadsForExport, formatMessagesForExport } from '@/lib/csv-export'
import { useToast } from '@/hooks/use-toast'
import { Lead } from '@/lib/supabase'

interface QuickActionsProps {
  onAddLead: () => void
  onGenerateMessage: () => void
  onViewAnalytics: () => void
  onSettings: () => void
  totalLeads: number
  totalMessages: number
  leads: Lead[]
  messages: any[]
  onRefresh: () => void
  isLoading?: boolean
}

export function QuickActions({
  onAddLead,
  onGenerateMessage,
  onViewAnalytics,
  onSettings,
  totalLeads,
  totalMessages,
  leads,
  messages,
  onRefresh,
  isLoading = false
}: QuickActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // 导出线索和消息
      const leadsData = formatLeadsForExport(leads)
      const messagesData = formatMessagesForExport(messages)
      
      exportLeadsToCSV(leadsData, {
        filename: `leads_export_${new Date().toISOString().split('T')[0]}.csv`
      })
      
      exportMessagesToCSV(messagesData, {
        filename: `messages_export_${new Date().toISOString().split('T')[0]}.csv`
      })
      
      toast({
        title: "导出成功",
        description: `已导出 ${leads.length} 条线索和 ${messages.length} 条消息`,
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleCSVImport = () => {
    setShowCSVImport(true)
  }

  const actions = [
    {
      title: '添加线索',
      description: '手动添加新的销售线索',
      icon: Plus,
      onClick: onAddLead,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: '生成消息',
      description: '使用AI生成个性化消息',
      icon: Sparkles,
      onClick: onGenerateMessage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200'
    },
    {
      title: '批量导入',
      description: '从CSV文件批量导入线索',
      icon: Upload,
      onClick: handleCSVImport,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200'
    },
    {
      title: '导出数据',
      description: '导出线索和消息数据',
      icon: Download,
      onClick: handleExport,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200',
      loading: isExporting
    }
  ]

  const stats = [
    {
      title: '总线索数',
      value: totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '总消息数',
      value: totalMessages,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: '今日活跃',
      value: Math.floor(totalLeads * 0.3),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 快速操作 */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>快速操作</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.onClick}
                disabled={action.loading}
                className={`h-auto p-4 flex flex-col items-center space-y-2 border-2 ${action.borderColor} ${action.bgColor} transition-all duration-200 hover:scale-105`}
              >
                {action.loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                ) : (
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                )}
                <div className="text-center">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="card-modern hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快捷导航 */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <span>快捷导航</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={onViewAnalytics}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">数据分析</div>
                <div className="text-xs text-gray-600">查看详细统计</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={onSettings}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Settings className="h-6 w-6 text-gray-600" />
              <div className="text-center">
                <div className="font-medium">设置</div>
                <div className="text-xs text-gray-600">配置系统参数</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Clock className="h-6 w-6 text-orange-600" />
              <div className="text-center">
                <div className="font-medium">最近活动</div>
                <div className="text-xs text-gray-600">查看操作历史</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* CSV导入模态框 */}
      {showCSVImport && (
        <CSVImport
          onImportComplete={() => {
            setShowCSVImport(false)
            onRefresh()
          }}
          onClose={() => setShowCSVImport(false)}
        />
      )}
    </div>
  )
} 