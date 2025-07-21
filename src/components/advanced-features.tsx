'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { 
  Settings,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  Filter,
  Users,
  MessageSquare,
  Trash2,
  RefreshCw,
  BarChart3,
  Target
} from 'lucide-react'
import { CSVImport } from './csv-import'
import { exportLeadsToCSV, exportMessagesToCSV, formatLeadsForExport, formatMessagesForExport } from '@/lib/csv-export'
import { useToast } from '@/hooks/use-toast'
import { Lead } from '@/lib/supabase'

interface AdvancedFeaturesProps {
  leads: Lead[]
  messages: { status: string }[]
  onRefresh: () => void
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkGenerateMessages: (leads: Lead[]) => Promise<void>
  onBulkStatusUpdate: (ids: string[], status: string) => Promise<void>
  onViewAnalytics: () => void
  onSettings: () => void
  isLoading?: boolean
}

export function AdvancedFeatures({
  leads,
  messages,
  onRefresh,
  onBulkDelete,
  onBulkGenerateMessages,
  onBulkStatusUpdate,
  onViewAnalytics,
  onSettings,
  isLoading = false
}: AdvancedFeaturesProps) {
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
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

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return
    
    try {
      await onBulkDelete(selectedLeads.map(lead => lead.id))
      setSelectedLeads([])
    } catch (error) {
      console.error('Bulk delete failed:', error)
    }
  }

  const handleBulkGenerateMessages = async () => {
    if (selectedLeads.length === 0) return
    
    try {
      await onBulkGenerateMessages(selectedLeads)
      setSelectedLeads([])
    } catch (error) {
      console.error('Bulk generate messages failed:', error)
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedLeads.length === 0) return
    
    try {
      await onBulkStatusUpdate(selectedLeads.map(lead => lead.id), status)
      setSelectedLeads([])
    } catch (error) {
      console.error('Bulk status update failed:', error)
    }
  }

  return (
    <div className="space-y-4">
      {/* 高级功能切换按钮 */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex items-center justify-between p-4"
          >
            <span className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>高级功能</span>
            </span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {/* 数据管理 */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>数据管理</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCSVImport}
                  className="h-auto p-4 flex flex-col items-center space-y-2 border-2 border-green-200 bg-green-50 hover:bg-green-100"
                >
                  <Upload className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <div className="font-medium text-gray-900">批量导入</div>
                    <div className="text-xs text-gray-600">从CSV文件导入线索</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="h-auto p-4 flex flex-col items-center space-y-2 border-2 border-orange-200 bg-orange-50 hover:bg-orange-100"
                >
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                  ) : (
                    <Download className="h-6 w-6 text-orange-600" />
                  )}
                  <div className="text-center">
                    <div className="font-medium text-gray-900">导出数据</div>
                    <div className="text-xs text-gray-600">导出线索和消息</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 批量操作 */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>批量操作</span>
                {selectedLeads.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    已选择 {selectedLeads.length} 条
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 选择提示 */}
                {selectedLeads.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    请在线索表格中选择要操作的线索
                  </div>
                )}
                
                {/* 批量操作按钮 */}
                {selectedLeads.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBulkGenerateMessages}
                      className="flex items-center space-x-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>批量生成消息</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleBulkStatusUpdate('Active')}
                      className="flex items-center space-x-2"
                    >
                      <Target className="h-4 w-4" />
                      <span>设为活跃</span>
                    </Button>
                    
                    <Button
                      variant="destructive"
                      onClick={handleBulkDelete}
                      className="flex items-center space-x-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>批量删除</span>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 系统操作 */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <span>系统操作</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>刷新数据</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onViewAnalytics}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>查看分析</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onSettings}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>系统设置</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 统计信息 */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>数据统计</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
                  <div className="text-sm text-gray-600">总线索数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{messages.length}</div>
                  <div className="text-sm text-gray-600">总消息数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {leads.filter(lead => lead.status === 'Active').length}
                  </div>
                  <div className="text-sm text-gray-600">活跃线索</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {messages.filter(m => m.status === 'Approved').length}
                  </div>
                  <div className="text-sm text-gray-600">已批准消息</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* CSV导入模态框 */}
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