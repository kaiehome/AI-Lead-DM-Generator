'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Upload, Download, CheckCircle, AlertCircle, X } from 'lucide-react'
import Papa from 'papaparse'

interface CSVImportProps {
  onImportComplete: () => void
  onClose: () => void
}

interface LeadData {
  name: string
  role: string
  company: string
  linkedin_url?: string
  industry?: string
  company_size?: string
  email?: string
  location?: string
  notes?: string
}

interface ImportResult {
  success: number
  failed: number
  duplicates: number
  errors: string[]
}

const CSV_TEMPLATE = `name,role,company,linkedin_url,industry,company_size,email,location,notes
John Doe,Marketing Manager,Tech Corp,https://linkedin.com/in/johndoe,Technology,50-200,john@techcorp.com,San Francisco,Interested in AI solutions
Jane Smith,Sales Director,Startup Inc,https://linkedin.com/in/janesmith,Startup,10-50,jane@startup.com,New York,Looking for growth opportunities`

export function CSVImport({ onImportComplete, onClose }: CSVImportProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [csvData, setCsvData] = useState<Record<string, string>[]>([])
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([])
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const defaultFields = ['name', 'role', 'company', 'linkedin_url', 'industry', 'company_size', 'email', 'location', 'notes']

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false)
        setProgress(100)
        
        if (results.errors.length > 0) {
          toast({
            title: "解析错误",
            description: "CSV文件格式有误，请检查后重试",
            variant: "destructive",
          })
          return
        }

        const data = results.data as Record<string, string>[]
        setCsvData(data)
        setPreviewData(data.slice(0, 5)) // 只显示前5行预览

        // 自动映射字段
        const headers = Object.keys(data[0] || {})
        const mapping: Record<string, string> = {}
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase()
          const matchedField = defaultFields.find(field => 
            lowerHeader.includes(field) || field.includes(lowerHeader)
          )
          if (matchedField) {
            mapping[header] = matchedField
          }
        })
        setFieldMapping(mapping)

        toast({
          title: "文件上传成功",
          description: `解析到 ${data.length} 条记录`,
        })
      },
      error: (error) => {
        setIsUploading(false)
        toast({
          title: "上传失败",
          description: error.message,
          variant: "destructive",
        })
      }
    })
  }

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    if (csvData.length === 0) return

    setIsImporting(true)
    setProgress(0)
    setImportResult(null)

    try {
      // 转换数据格式
      const transformedData = csvData.map(row => {
        const transformed: Record<string, string> = {}
        Object.keys(fieldMapping).forEach(csvField => {
          const targetField = fieldMapping[csvField]
          if (targetField) {
            transformed[targetField] = row[csvField]
          }
        })
        return transformed
      })

      // 批量导入
      const response = await fetch('/api/leads/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: transformedData }),
      })

      if (!response.ok) {
        throw new Error('导入失败')
      }

      const result = await response.json()
      setImportResult(result)
      setProgress(100)

      toast({
        title: "导入完成",
        description: `成功导入 ${result.success} 条，失败 ${result.failed} 条，重复 ${result.duplicates} 条`,
        variant: result.failed > 0 ? "destructive" : "default",
      })

      if (result.success > 0) {
        onImportComplete()
      }
    } catch (error) {
      toast({
        title: "导入失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const resetImport = () => {
    setCsvData([])
    setPreviewData([])
    setFieldMapping({})
    setImportResult(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="card-modern max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-500" />
              <span>批量导入线索</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 步骤1: 下载模板 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">步骤1: 下载模板</h3>
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              下载CSV模板
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              下载模板文件，按照格式填写数据后上传
            </p>
          </div>

          {/* 步骤2: 上传文件 */}
          <div>
            <h3 className="text-lg font-semibold mb-3">步骤2: 上传CSV文件</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? '上传中...' : '选择CSV文件'}
              </Button>
              {isUploading && (
                <div className="mt-4">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          </div>

          {/* 步骤3: 预览和映射 */}
          {csvData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">步骤3: 数据预览</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {Object.keys(csvData[0] || {}).map(field => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm font-medium">CSV字段: {field}</label>
                      <select
                        value={fieldMapping[field] || ''}
                        onChange={(e) => setFieldMapping(prev => ({
                          ...prev,
                          [field]: e.target.value
                        }))}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="">不导入</option>
                        {defaultFields.map(defField => (
                          <option key={defField} value={defField}>
                            {defField}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(previewData[0] || {}).map(field => (
                          <th key={field} className="text-left p-2">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="p-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      显示前5行，共 {csvData.length} 行数据
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 步骤4: 导入 */}
          {csvData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">步骤4: 开始导入</h3>
              <div className="flex space-x-4">
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="flex-1"
                >
                  {isImporting ? '导入中...' : `导入 ${csvData.length} 条记录`}
                </Button>
                <Button
                  onClick={resetImport}
                  variant="outline"
                  disabled={isImporting}
                >
                  重新选择
                </Button>
              </div>
              {isImporting && (
                <div className="mt-4">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </div>
          )}

          {/* 导入结果 */}
          {importResult && (
            <div>
              <h3 className="text-lg font-semibold mb-3">导入结果</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                  <div className="text-sm text-green-600">成功导入</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{importResult.duplicates}</div>
                  <div className="text-sm text-yellow-600">重复记录</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <X className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                  <div className="text-sm text-red-600">导入失败</div>
                </div>
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">错误详情:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>... 还有 {importResult.errors.length - 5} 个错误</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 