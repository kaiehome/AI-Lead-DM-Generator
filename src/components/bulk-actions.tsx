'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { 
  Trash2, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Sparkles,
  RefreshCw
} from 'lucide-react'
import { Lead } from '@/lib/supabase'

interface BulkActionsProps {
  selectedLeads: Lead[]
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkGenerateMessages: (leads: Lead[]) => Promise<void>
  onBulkStatusUpdate: (ids: string[], status: string) => Promise<void>
  onClearSelection: () => void
}

export function BulkActions({
  selectedLeads,
  onBulkDelete,
  onBulkGenerateMessages,
  onBulkStatusUpdate,
  onClearSelection
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentAction, setCurrentAction] = useState<string>('')
  const { toast } = useToast()

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return

    const confirmed = window.confirm(
      `确定要删除选中的 ${selectedLeads.length} 条线索吗？此操作不可撤销。`
    )

    if (!confirmed) return

    setIsProcessing(true)
    setCurrentAction('删除中...')
    setProgress(0)

    try {
      const ids = selectedLeads.map(lead => lead.id)
      await onBulkDelete(ids)
      
      toast({
        title: "批量删除成功",
        description: `已删除 ${selectedLeads.length} 条线索`,
        variant: "success",
      })
      
      onClearSelection()
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setCurrentAction('')
      setProgress(0)
    }
  }

  const handleBulkGenerateMessages = async () => {
    if (selectedLeads.length === 0) return

    setIsProcessing(true)
    setCurrentAction('生成消息中...')
    setProgress(0)

    try {
      await onBulkGenerateMessages(selectedLeads)
      
      toast({
        title: "批量生成成功",
        description: `已为 ${selectedLeads.length} 条线索生成消息`,
        variant: "success",
      })
      
      onClearSelection()
    } catch (error) {
      toast({
        title: "批量生成失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setCurrentAction('')
      setProgress(0)
    }
  }

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedLeads.length === 0) return

    setIsProcessing(true)
    setCurrentAction('更新状态中...')
    setProgress(0)

    try {
      const ids = selectedLeads.map(lead => lead.id)
      await onBulkStatusUpdate(ids, status)
      
      toast({
        title: "状态更新成功",
        description: `已更新 ${selectedLeads.length} 条线索的状态为 ${status}`,
        variant: "success",
      })
      
      onClearSelection()
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setCurrentAction('')
      setProgress(0)
    }
  }

  if (selectedLeads.length === 0) {
    return null
  }

  return (
    <Card className="card-modern border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>批量操作</span>
            <Badge variant="secondary" className="text-xs">
              {selectedLeads.length} 条已选中
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            取消选择
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{currentAction}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            onClick={handleBulkDelete}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            批量删除
          </Button>

          <Button
            onClick={handleBulkGenerateMessages}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            生成消息
          </Button>

          <Button
            onClick={() => handleBulkStatusUpdate('Active')}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            设为活跃
          </Button>

          <Button
            onClick={() => handleBulkStatusUpdate('Inactive')}
            disabled={isProcessing}
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            设为非活跃
          </Button>
        </div>

        {/* 选中项目预览 */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">选中的线索:</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {selectedLeads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                <div>
                  <span className="font-medium">{lead.name}</span>
                  <span className="text-gray-500 ml-2">{lead.role} at {lead.company}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {lead.status}
                </Badge>
              </div>
            ))}
            {selectedLeads.length > 5 && (
              <div className="text-xs text-gray-500 text-center py-1">
                ... 还有 {selectedLeads.length - 5} 条线索
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 