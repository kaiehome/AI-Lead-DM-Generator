'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { 
  CheckCircle, 
  Clock, 
  Send, 
  Edit, 
  MoreHorizontal,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface MessageStatusProps {
  messageId: string
  currentStatus: string
  onStatusChange: (messageId: string, newStatus: string) => Promise<void>
  disabled?: boolean
}

const STATUS_OPTIONS = [
  { value: 'Draft', label: '草稿', icon: Edit, color: 'bg-gray-100 text-gray-700' },
  { value: 'Pending', label: '待审核', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Approved', label: '已批准', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  { value: 'Sent', label: '已发送', icon: Send, color: 'bg-blue-100 text-blue-700' },
  { value: 'Rejected', label: '已拒绝', icon: AlertCircle, color: 'bg-red-100 text-red-700' }
]

export function MessageStatus({ 
  messageId, 
  currentStatus, 
  onStatusChange, 
  disabled = false 
}: MessageStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const currentStatusOption = STATUS_OPTIONS.find(option => option.value === currentStatus)
  const CurrentStatusIcon = currentStatusOption?.icon || Edit

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setIsUpdating(true)
    try {
      await onStatusChange(messageId, newStatus)
      toast({
        title: "状态更新成功",
        description: `消息状态已更新为 ${STATUS_OPTIONS.find(opt => opt.value === newStatus)?.label}`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "状态更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status)
    if (!option) return null

    const Icon = option.icon
    return (
      <Badge variant="outline" className={option.color}>
        <Icon className="h-3 w-3 mr-1" />
        {option.label}
      </Badge>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {isUpdating ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-500">更新中...</span>
        </div>
      ) : (
        <>
          {getStatusBadge(currentStatus)}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                disabled={disabled}
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {STATUS_OPTIONS.map((option) => {
                const Icon = option.icon
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={option.value === currentStatus}
                    className={option.value === currentStatus ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

// 批量状态更新组件
interface BulkMessageStatusProps {
  selectedMessageIds: string[]
  onBulkStatusChange: (messageIds: string[], newStatus: string) => Promise<void>
  disabled?: boolean
}

export function BulkMessageStatus({ 
  selectedMessageIds, 
  onBulkStatusChange, 
  disabled = false 
}: BulkMessageStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedMessageIds.length === 0) return

    setIsUpdating(true)
    try {
      await onBulkStatusChange(selectedMessageIds, newStatus)
      toast({
        title: "批量状态更新成功",
        description: `已更新 ${selectedMessageIds.length} 条消息的状态`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "批量状态更新失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (selectedMessageIds.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <span className="text-sm font-medium text-blue-700">
        已选择 {selectedMessageIds.length} 条消息
      </span>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={disabled || isUpdating}
            className="text-blue-600 border-blue-200 hover:bg-blue-100"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                更新中...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                批量更新状态
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleBulkStatusChange(option.value)}
              >
                <Icon className="h-4 w-4 mr-2" />
                设为{option.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 