'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  Building, 
  Briefcase,
  Calendar,
  SortAsc,
  SortDesc,
  Save,
  Bookmark,
  Settings,
  Zap,
  Target,
  MapPin,
  Mail,
  Clock,
  TrendingUp,
  FilterX,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  onClear: () => void
  onExport?: () => void
  onImport?: () => void
  isLoading?: boolean
}

interface FilterOptions {
  status: string
  industry: string
  company: string
  companySize: string
  location: string
  dateRange: string
  hasLinkedIn: boolean
  hasEmail: boolean
  hasNotes: boolean
  messageStatus: string
}

interface FilterPreset {
  id: string
  name: string
  filters: FilterOptions
  isDefault?: boolean
}

export function SearchFilter({ 
  onSearch, 
  onFilter, 
  onSort, 
  onClear, 
  onExport,
  onImport,
  isLoading = false 
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    industry: '',
    company: '',
    companySize: '',
    location: '',
    dateRange: '',
    hasLinkedIn: false,
    hasEmail: false,
    hasNotes: false,
    messageStatus: ''
  })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [presets, setPresets] = useState<FilterPreset[]>([
    {
      id: '1',
      name: '高价值线索',
      filters: {
        status: '',
        industry: '',
        company: '',
        companySize: '501-1000 employees',
        location: '',
        dateRange: '',
        hasLinkedIn: true,
        hasEmail: true,
        hasNotes: false,
        messageStatus: ''
      },
      isDefault: true
    },
    {
      id: '2',
      name: '科技行业',
      filters: {
        status: '',
        industry: 'Technology',
        company: '',
        companySize: '',
        location: '',
        dateRange: '',
        hasLinkedIn: false,
        hasEmail: false,
        hasNotes: false,
        messageStatus: ''
      }
    },
    {
      id: '3',
      name: '本周新增',
      filters: {
        status: '',
        industry: '',
        company: '',
        companySize: '',
        location: '',
        dateRange: 'week',
        hasLinkedIn: false,
        hasEmail: false,
        hasNotes: false,
        messageStatus: ''
      }
    }
  ])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterChange = (key: keyof FilterOptions, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleSort = (field: string) => {
    const newOrder = field === sortBy && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(newOrder)
    onSort(field, newOrder)
  }

  const handleClear = () => {
    setSearchQuery('')
    setFilters({
      status: '',
      industry: '',
      company: '',
      companySize: '',
      location: '',
      dateRange: '',
      hasLinkedIn: false,
      hasEmail: false,
      hasNotes: false,
      messageStatus: ''
    })
    setSortBy('name')
    setSortOrder('asc')
    onClear()
  }

  const handlePresetSelect = (preset: FilterPreset) => {
    setFilters(preset.filters)
    onFilter(preset.filters)
  }

  const handleSavePreset = () => {
    const presetName = prompt('请输入预设名称:')
    if (presetName) {
      const newPreset: FilterPreset = {
        id: Date.now().toString(),
        name: presetName,
        filters: { ...filters }
      }
      setPresets(prev => [...prev, newPreset])
    }
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '' && v !== false) || searchQuery !== ''

  return (
    <div className="space-y-6 mb-6">
      {/* 主搜索栏 */}
      <Card className="card-modern">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索输入框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索线索姓名、职位、公司、行业..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 h-11 input-modern"
                disabled={isLoading}
              />
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="btn-secondary-modern"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4 mr-2" />
                {isExpanded ? '收起筛选' : '高级筛选'}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="btn-secondary-modern"
                  disabled={isLoading}
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  清除筛选
                </Button>
              )}

              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  className="btn-secondary-modern"
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  导出
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 筛选预设 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          筛选预设:
        </span>
        
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="ghost"
            size="sm"
            onClick={() => handlePresetSelect(preset)}
            className="text-xs h-8"
          >
            {preset.name}
            {preset.isDefault && <Badge variant="outline" className="ml-1 text-xs">默认</Badge>}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSavePreset}
          className="text-xs h-8"
          disabled={!hasActiveFilters}
        >
          <Save className="h-3 w-3 mr-1" />
          保存预设
        </Button>
      </div>

      {/* 高级筛选面板 */}
      {isExpanded && (
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              高级筛选
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  基础筛选
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  高级选项
                </TabsTrigger>
                <TabsTrigger value="sort" className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4" />
                  排序设置
                </TabsTrigger>
              </TabsList>

              {/* 基础筛选标签页 */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 状态筛选 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      线索状态
                    </Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="input-modern min-w-[120px]">
                        <SelectValue placeholder="选择状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部状态</SelectItem>
                        <SelectItem value="Active">活跃</SelectItem>
                        <SelectItem value="Inactive">非活跃</SelectItem>
                        <SelectItem value="Converted">已转化</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 行业筛选 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      行业
                    </Label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => handleFilterChange('industry', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="input-modern min-w-[120px]">
                        <SelectValue placeholder="选择行业" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部行业</SelectItem>
                        <SelectItem value="Technology">科技</SelectItem>
                        <SelectItem value="Finance">金融</SelectItem>
                        <SelectItem value="Healthcare">医疗健康</SelectItem>
                        <SelectItem value="Education">教育</SelectItem>
                        <SelectItem value="Manufacturing">制造业</SelectItem>
                        <SelectItem value="Retail">零售</SelectItem>
                        <SelectItem value="Consulting">咨询</SelectItem>
                        <SelectItem value="Marketing">营销</SelectItem>
                        <SelectItem value="Sales">销售</SelectItem>
                        <SelectItem value="Other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 公司规模 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      公司规模
                    </Label>
                    <Select
                      value={filters.companySize}
                      onValueChange={(value) => handleFilterChange('companySize', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="input-modern min-w-[120px]">
                        <SelectValue placeholder="选择规模" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部规模</SelectItem>
                        <SelectItem value="1-10 employees">1-10人</SelectItem>
                        <SelectItem value="11-50 employees">11-50人</SelectItem>
                        <SelectItem value="51-200 employees">51-200人</SelectItem>
                        <SelectItem value="201-500 employees">201-500人</SelectItem>
                        <SelectItem value="501-1000 employees">501-1000人</SelectItem>
                        <SelectItem value="1001-5000 employees">1001-5000人</SelectItem>
                        <SelectItem value="5000+ employees">5000+人</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 日期范围 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      创建时间
                    </Label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => handleFilterChange('dateRange', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="input-modern min-w-[120px]">
                        <SelectValue placeholder="选择时间范围" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部时间</SelectItem>
                        <SelectItem value="today">今天</SelectItem>
                        <SelectItem value="week">本周</SelectItem>
                        <SelectItem value="month">本月</SelectItem>
                        <SelectItem value="quarter">本季度</SelectItem>
                        <SelectItem value="year">本年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 公司名称 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      公司名称
                    </Label>
                    <Input
                      placeholder="输入公司名称关键词"
                      value={filters.company}
                      onChange={(e) => handleFilterChange('company', e.target.value)}
                      className="input-modern"
                      disabled={isLoading}
                    />
                  </div>

                  {/* 地理位置 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      地理位置
                    </Label>
                    <Input
                      placeholder="输入城市或地区"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="input-modern"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* 高级选项标签页 */}
              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 消息状态 */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      消息状态
                    </Label>
                    <Select
                      value={filters.messageStatus}
                      onValueChange={(value) => handleFilterChange('messageStatus', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="input-modern min-w-[120px]">
                        <SelectValue placeholder="选择消息状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部消息状态</SelectItem>
                        <SelectItem value="Draft">草稿</SelectItem>
                        <SelectItem value="Approved">已批准</SelectItem>
                        <SelectItem value="Sent">已发送</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 高级选项开关 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasLinkedIn" className="flex items-center gap-2">
                        <span>有LinkedIn链接</span>
                      </Label>
                      <Switch
                        id="hasLinkedIn"
                        checked={filters.hasLinkedIn}
                        onCheckedChange={(checked) => handleFilterChange('hasLinkedIn', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasEmail" className="flex items-center gap-2">
                        <span>有邮箱地址</span>
                      </Label>
                      <Switch
                        id="hasEmail"
                        checked={filters.hasEmail}
                        onCheckedChange={(checked) => handleFilterChange('hasEmail', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hasNotes" className="flex items-center gap-2">
                        <span>有备注信息</span>
                      </Label>
                      <Switch
                        id="hasNotes"
                        checked={filters.hasNotes}
                        onCheckedChange={(checked) => handleFilterChange('hasNotes', checked)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 排序设置标签页 */}
              <TabsContent value="sort" className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">排序选项</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button
                      variant={sortBy === 'name' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="justify-start"
                      disabled={isLoading}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      姓名
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-auto" /> : <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </Button>

                    <Button
                      variant={sortBy === 'company' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('company')}
                      className="justify-start"
                      disabled={isLoading}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      公司
                      {sortBy === 'company' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-auto" /> : <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </Button>

                    <Button
                      variant={sortBy === 'role' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('role')}
                      className="justify-start"
                      disabled={isLoading}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      职位
                      {sortBy === 'role' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-auto" /> : <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </Button>

                    <Button
                      variant={sortBy === 'created_at' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSort('created_at')}
                      className="justify-start"
                      disabled={isLoading}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      创建时间
                      {sortBy === 'created_at' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4 ml-auto" /> : <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* 活跃筛选器显示 */}
      {hasActiveFilters && (
        <Card className="card-modern">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                活跃筛选:
              </span>
              
              {searchQuery && (
                <Badge variant="secondary" className="badge-status">
                  搜索: {searchQuery}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleSearch('')}
                  />
                </Badge>
              )}
              
              {filters.status && (
                <Badge variant="secondary" className="badge-status">
                  状态: {filters.status}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('status', '')}
                  />
                </Badge>
              )}
              
              {filters.industry && (
                <Badge variant="secondary" className="badge-status">
                  行业: {filters.industry}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('industry', '')}
                  />
                </Badge>
              )}
              
              {filters.company && (
                <Badge variant="secondary" className="badge-status">
                  公司: {filters.company}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('company', '')}
                  />
                </Badge>
              )}

              {filters.companySize && (
                <Badge variant="secondary" className="badge-status">
                  规模: {filters.companySize}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('companySize', '')}
                  />
                </Badge>
              )}

              {filters.location && (
                <Badge variant="secondary" className="badge-status">
                  位置: {filters.location}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('location', '')}
                  />
                </Badge>
              )}
              
              {filters.dateRange && (
                <Badge variant="secondary" className="badge-status">
                  时间: {filters.dateRange}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('dateRange', '')}
                  />
                </Badge>
              )}

              {filters.hasLinkedIn && (
                <Badge variant="secondary" className="badge-status">
                  有LinkedIn
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('hasLinkedIn', false)}
                  />
                </Badge>
              )}

              {filters.hasEmail && (
                <Badge variant="secondary" className="badge-status">
                  有邮箱
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('hasEmail', false)}
                  />
                </Badge>
              )}

              {filters.hasNotes && (
                <Badge variant="secondary" className="badge-status">
                  有备注
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('hasNotes', false)}
                  />
                </Badge>
              )}

              {filters.messageStatus && (
                <Badge variant="secondary" className="badge-status">
                  消息: {filters.messageStatus}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                    onClick={() => handleFilterChange('messageStatus', '')}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 