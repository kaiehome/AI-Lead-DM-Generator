'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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

  Clock,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { CSVImport } from './csv-import'
import { exportLeadsToCSV, exportMessagesToCSV, formatLeadsForExport, formatMessagesForExport } from '@/lib/csv-export'
import { useToast } from '@/hooks/use-toast'
import { Lead, Message } from '@/lib/supabase'

interface SimplifiedQuickActionsProps {
  onAddLead: () => void
  onGenerateMessage: () => void
  onViewAnalytics: () => void
  onSettings: () => void
  totalLeads: number
  totalMessages: number
  leads: Lead[]
  messages: Message[]
  onRefresh: () => void

}

export function SimplifiedQuickActions({
  onAddLead,
  onGenerateMessage,
  onViewAnalytics,
  onSettings,
  totalLeads,
  totalMessages,
  leads,
  messages,
  onRefresh,
}: SimplifiedQuickActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
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

  // Core Actions
  const primaryActions = [
    {
      title: 'Add Lead',
      description: 'Manually add new sales lead',
      icon: Plus,
      onClick: onAddLead,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      loading: false
    },
    {
      title: 'Generate Message',
      description: 'Use AI to generate personalized message',
      icon: Sparkles,
      onClick: onGenerateMessage,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      loading: false
    }
  ]

  // 高级操作
  const advancedActions = [
    {
      title: 'Export Data',
      description: 'Export leads and messages data',
      icon: Download,
      onClick: handleExport,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      loading: isExporting
    },
    {
      title: 'Bulk Import',
      description: 'Import leads from CSV file',
      icon: Upload,
      onClick: handleCSVImport,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      borderColor: 'border-orange-200',
      loading: false
    }
  ]

  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Today',
      value: Math.floor(totalLeads * 0.3),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Core Quick Actions */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-blue-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={action.onClick}
                disabled={action.loading}
                className={`h-auto p-6 flex flex-col items-center space-y-3 border-2 ${action.borderColor} ${action.bgColor} transition-all duration-200 hover:scale-105`}
              >
                {action.loading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                ) : (
                  <action.icon className={`h-8 w-8 ${action.color}`} />
                )}
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-lg">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

              {/* Statistics Overview */}
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

      {/* Advanced Features */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between p-4"
          >
            <span className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Advanced Features</span>
            </span>
            {showAdvanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advancedActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={action.onClick}
                    disabled={action.loading}
                    className={`h-auto p-4 flex flex-col items-center space-y-2 border-2 ${action.borderColor} ${action.bgColor} transition-all duration-200`}
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

          {/* System Operations */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">System Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  className="flex items-center space-x-2"
                >
                  <Clock className="h-4 w-4" />
                  <span>Refresh Data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onViewAnalytics}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>View Analytics</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={onSettings}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* CSV Import Modal */}
      {showCSVImport && (
        <CSVImport
          onClose={() => setShowCSVImport(false)}
          onImportComplete={() => {
            setShowCSVImport(false)
            onRefresh()
          }}
        />
      )}
    </div>
  )
} 