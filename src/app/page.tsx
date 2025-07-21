'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeads } from '@/hooks/use-leads';
import { useGenerateMessage } from '@/hooks/use-message-generation';
import { useCreateMessage } from '@/hooks/use-messages';
import { Lead, CreateLeadData } from '@/lib/supabase';
import { SimplifiedLeadForm } from '@/components/simplified-lead-form';
import { SimplifiedLeadsTable } from '@/components/simplified-leads-table';
import { exportLeadsToCSV, formatLeadsForExport } from '@/lib/csv-export';
import { MessageSquare, Users, Plus, Sparkles, Target, TrendingUp, UserPlus, MessageCircle, Copy, Upload } from 'lucide-react';

export default function Home() {
  // State management
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);
  const [isAddingLead, setIsAddingLead] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string>('generate'); // 新增：跟踪选中的操作
  const [showNoLeadsMessage, setShowNoLeadsMessage] = useState<boolean>(false); // 新增：显示无潜在客户提示
  const [showMessageGenerator, setShowMessageGenerator] = useState<boolean>(false); // 新增：显示消息生成器
  const [customContext, setCustomContext] = useState<string>(''); // 新增：自定义上下文
  const [messageStyle, setMessageStyle] = useState<string>('professional'); // 新增：消息风格
  const [messageTarget, setMessageTarget] = useState<string>('connection'); // 新增：消息目标
  const [messageLength, setMessageLength] = useState<string>('standard'); // 新增：消息长度
  const [includeEmojis, setIncludeEmojis] = useState<boolean>(false); // 新增：是否包含表情
  const [selectedLeadForMessage, setSelectedLeadForMessage] = useState<Lead | null>(null); // 新增：选中的潜在客户
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false); // 新增：是否为批量模式
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false); // 新增：显示成功提示
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false); // 新增：显示错误提示
  const [errorMessage, setErrorMessage] = useState<string>(''); // 新增：错误消息内容
  // 使用真实的Supabase数据
  const { data: leadsData, isLoading, error, refetch } = useLeads();
  const leads = leadsData?.leads || [];
  const { mutate: generateMessage } = useGenerateMessage();
  const createMessage = useCreateMessage();
  
  // Refs for auto-scrolling
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to result when message is generated
  useEffect(() => {
    if (generatedMessage && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [generatedMessage]);

  const handleAddLead = async (data: CreateLeadData) => {
    setIsAddingLead(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await refetch();
        setShowLeadForm(false);
        console.log('Lead added successfully');
      } else {
        throw new Error('Failed to add lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    } finally {
      setIsAddingLead(false);
    }
  };

  const handleGenerateMessage = async (leadIds: string[]) => {
    if (leadIds.length === 0) return;
    
    console.log('🚀 Starting message generation for leads:', leadIds);
    setIsGenerating(true);
    setGeneratedMessage('');
    
    try {
      const selectedLeadsData = leads.filter((lead: Lead) => leadIds.includes(lead.id));
      console.log('📋 Selected leads data:', selectedLeadsData);
      
      // Generate message for the first selected lead (for now)
      const lead = selectedLeadsData[0] as Lead;
      console.log('🎯 Generating message for lead:', lead);
      
      const messageParams = {
        name: lead.name,
        company: lead.company,
        role: lead.role,
        industry: '',
        style: 'professional' as const,
        target: 'connection' as const,
        length: 'standard' as const,
        include_emojis: false
      };
      
      console.log('📝 Message parameters:', messageParams);
      
      generateMessage(messageParams, {
        onSuccess: async (result) => {
          console.log('✅ Message generated successfully:', result);
          const message = result.message;
          setGeneratedMessage(message);
          
          // Save message to database for each selected lead
          for (const leadId of leadIds) {
            try {
              await createMessage.mutateAsync({
                lead_id: leadId,
                content: message,
                status: 'Draft',
                template_used: 'AI Generated (Default)',
                ai_model: 'GPT-4',
                character_count: message.length,
                generated_at: new Date().toISOString()
              });
              console.log('💾 Message saved for lead:', leadId);
            } catch (error) {
              console.error('❌ Failed to save message for lead:', leadId, error);
            }
          }
          
          // 显示成功提示
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
          
          // 自动滚动到生成的消息
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        },
        onError: (error) => {
          console.error('❌ Failed to generate message:', error);
          // 显示错误提示
          setErrorMessage(error.message || '生成消息失败，请重试');
          setShowErrorMessage(true);
          setTimeout(() => setShowErrorMessage(false), 5000);
        }
      });
    } catch (error) {
      console.error('❌ Error in handleGenerateMessage:', error);
      setErrorMessage(error instanceof Error ? error.message : '处理消息生成时出错');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    } finally {
      console.log('🏁 Message generation process completed');
      setIsGenerating(false);
    }
  };



  const handleExportLeads = () => {
    setSelectedAction('export-leads');
    const formattedLeads = formatLeadsForExport(leads);
    exportLeadsToCSV(formattedLeads);
  };

  const handleExportMessages = () => {
    setSelectedAction('export-messages');
    // This would need to fetch messages data
    // For now, we'll show a placeholder
    console.log('Export messages functionality to be implemented');
  };

  const handleManageLeads = () => {
    setSelectedAction('manage-leads');
  };

  // 新增：处理单个消息生成
  const handleSingleMessageGenerate = () => {
    setSelectedAction('generate-single');
    if (selectedLeads.length === 0) {
      setShowNoLeadsMessage(true);
      setTimeout(() => setShowNoLeadsMessage(false), 3000);
      return;
    }
    
    // 设置单个模式
    setIsBulkMode(false);
    
    // 如果只选中一个潜在客户，直接使用它
    if (selectedLeads.length === 1) {
      const lead = leads.find((l: Lead) => l.id === selectedLeads[0]);
      setSelectedLeadForMessage(lead || null);
      setShowMessageGenerator(true);
    } else {
      // 如果选中多个，让用户选择其中一个
      setShowMessageGenerator(true);
    }
  };

  // 新增：处理批量消息生成
  const handleBulkMessageGenerate = () => {
    setSelectedAction('generate-bulk');
    if (selectedLeads.length === 0) {
      setShowNoLeadsMessage(true);
      setTimeout(() => setShowNoLeadsMessage(false), 3000);
      return;
    }
    
    // 设置批量模式并弹出输入框
    setIsBulkMode(true);
    setSelectedLeadForMessage(null); // 批量模式下不需要选择单个潜在客户
    setShowMessageGenerator(true);
  };

  // 新增：处理自定义消息生成
  const handleCustomMessageGenerate = async () => {
    if (isBulkMode) {
      // 批量模式：为所有选中的潜在客户生成消息
      if (selectedLeads.length === 0) return;
      
      setIsGenerating(true);
      setGeneratedMessage('');
      setShowMessageGenerator(false);
      
      try {
        // 为第一个潜在客户生成消息作为模板
        const firstLead = leads.find((l: Lead) => l.id === selectedLeads[0]);
        if (!firstLead) return;
        
        generateMessage({
          name: firstLead.name,
          company: firstLead.company || '',
          role: firstLead.role,
          industry: '',
          style: messageStyle as 'professional' | 'friendly' | 'casual' | 'formal' | 'enthusiastic',
          target: messageTarget as 'connection' | 'business' | 'recruitment' | 'networking' | 'event' | 'collaboration',
          length: messageLength as 'short' | 'standard' | 'detailed',
          include_emojis: includeEmojis,
          custom_context: customContext
        }, {
          onSuccess: async (result) => {
            const message = result.message;
            setGeneratedMessage(message);
            
            // 为所有选中的潜在客户保存相同的消息
            for (const leadId of selectedLeads) {
              try {
                await createMessage.mutateAsync({
                  lead_id: leadId,
                  content: message,
                  status: 'Draft',
                  template_used: 'AI Generated (Bulk)',
                  ai_model: 'GPT-4',
                  character_count: message.length,
                  generated_at: new Date().toISOString()
                });
              } catch (error) {
                console.error('Failed to save message for lead:', leadId, error);
              }
            }
          },
          onError: (error) => {
            console.error('Failed to generate message:', error);
          }
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
      // 单个模式：为选中的潜在客户生成消息
      if (!selectedLeadForMessage) return;
      
      setIsGenerating(true);
      setGeneratedMessage('');
      setShowMessageGenerator(false);
      
      try {
        generateMessage({
          name: selectedLeadForMessage.name,
          company: selectedLeadForMessage.company || '',
          role: selectedLeadForMessage.role,
          industry: '',
          style: messageStyle as 'professional' | 'friendly' | 'casual' | 'formal' | 'enthusiastic',
          target: messageTarget as 'connection' | 'business' | 'recruitment' | 'networking' | 'event' | 'collaboration',
          length: messageLength as 'short' | 'standard' | 'detailed',
          include_emojis: includeEmojis,
          custom_context: customContext
        }, {
          onSuccess: async (result) => {
            const message = result.message;
            setGeneratedMessage(message);
            
            // 保存消息到数据库
            try {
              await createMessage.mutateAsync({
                lead_id: selectedLeadForMessage.id,
                content: message,
                status: 'Draft',
                template_used: 'AI Generated (Custom)',
                ai_model: 'GPT-4',
                character_count: message.length,
                generated_at: new Date().toISOString()
              });
            } catch (error) {
              console.error('Failed to save message:', error);
            }
          },
          onError: (error) => {
            console.error('Failed to generate message:', error);
          }
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-blue-600">Loading...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-600 font-medium">Loading failed: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Business Style Header */}
      <div className="business-header py-12 px-6 relative">
        <div className="container mx-auto text-center space-y-6 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              LinkedIn Smart Message Generator
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Generate personalized, professional LinkedIn messages for your prospects using AI technology
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Target className="h-5 w-5" />
              <span className="font-medium">Precision Targeting</span>
            </div>
            <div className="flex items-center gap-3 text-blue-100 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Boost Conversions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message Toast */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 border border-green-600 rounded-lg p-4 shadow-xl animate-bounce">
          <div className="flex items-center gap-3 text-white">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <div className="font-bold text-lg">✅ Success!</div>
              <div className="text-sm opacity-90">Message generated and saved</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {showErrorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 border border-red-600 rounded-lg p-4 shadow-xl animate-bounce">
          <div className="flex items-center gap-3 text-white">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div>
              <div className="font-bold text-lg">❌ Error!</div>
              <div className="text-sm opacity-90">{errorMessage}</div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6 space-y-6">
        {/* Lead Input Form Section */}
        <Card className="business-card">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <UserPlus className="h-5 w-5" />
              Add New Prospect
            </CardTitle>
            <CardDescription className="text-blue-600">
              Enter prospect information to start generating personalized LinkedIn messages
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {!showLeadForm ? (
              <div className="text-center py-6">
                <div className="p-3 bg-blue-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-base font-semibold text-blue-900 mb-2">Ready to Add Prospects</h3>
                <p className="text-blue-600 mb-4">Start building your prospect list to generate personalized messages</p>
                <Button 
                  onClick={() => setShowLeadForm(true)}
                  className="business-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prospect
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <SimplifiedLeadForm 
                  onSubmit={handleAddLead}
                  loading={isAddingLead}
                />
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLeadForm(false)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="business-card">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-blue-800 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-blue-600 text-base">
              Generate messages and manage your data efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Button
                onClick={handleSingleMessageGenerate}
                disabled={isGenerating}
                className={`h-auto p-8 flex flex-col items-center space-y-4 group transition-all duration-300 ${
                  selectedAction === 'generate-single'
                    ? 'business-button shadow-xl'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                ) : (
                  <div className={`p-4 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                    selectedAction === 'generate-single'
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                  }`}>
                    <MessageSquare className="h-10 w-10" />
                  </div>
                )}
                <span className="font-bold text-xl">Generate Message</span>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  selectedAction === 'generate-single'
                    ? 'opacity-90 bg-white/20'
                    : 'opacity-70 bg-blue-50'
                }`}>
                  Single lead
                </span>
              </Button>

              <Button
                onClick={handleBulkMessageGenerate}
                disabled={isGenerating}
                className={`h-auto p-8 flex flex-col items-center space-y-4 group transition-all duration-300 ${
                  selectedAction === 'generate-bulk'
                    ? 'business-button shadow-xl'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                ) : (
                  <div className={`p-4 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                    selectedAction === 'generate-bulk'
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                  }`}>
                    <MessageSquare className="h-10 w-10" />
                  </div>
                )}
                <span className="font-bold text-xl">Bulk Generate</span>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  selectedAction === 'generate-bulk'
                    ? 'opacity-90 bg-white/20'
                    : 'opacity-70 bg-blue-50'
                }`}>
                  {selectedLeads.length} selected
                </span>
              </Button>

              <Button
                onClick={handleExportLeads}
                className={`h-auto p-8 flex flex-col items-center space-y-4 group transition-all duration-300 ${
                  selectedAction === 'export-leads'
                    ? 'business-button shadow-xl'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className={`p-4 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                  selectedAction === 'export-leads'
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                }`}>
                  <Upload className="h-10 w-10" />
                </div>
                <span className="font-bold text-xl">Export Leads</span>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  selectedAction === 'export-leads'
                    ? 'opacity-90 bg-white/20'
                    : 'opacity-70 bg-blue-50'
                }`}>
                  CSV format
                </span>
              </Button>

              <Button
                onClick={handleExportMessages}
                className={`h-auto p-8 flex flex-col items-center space-y-4 group transition-all duration-300 ${
                  selectedAction === 'export-messages'
                    ? 'business-button shadow-xl'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className={`p-4 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                  selectedAction === 'export-messages'
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                }`}>
                  <MessageCircle className="h-10 w-10" />
                </div>
                <span className="font-bold text-xl">Export Messages</span>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  selectedAction === 'export-messages'
                    ? 'opacity-90 bg-white/20'
                    : 'opacity-70 bg-blue-50'
                }`}>
                  CSV format
                </span>
              </Button>

              <Button
                onClick={handleManageLeads}
                className={`h-auto p-8 flex flex-col items-center space-y-4 group transition-all duration-300 w-full ${
                  selectedAction === 'manage-leads'
                    ? 'business-button shadow-xl'
                    : 'bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <div className={`p-4 rounded-full group-hover:scale-110 transition-transform duration-300 ${
                  selectedAction === 'manage-leads'
                    ? 'bg-white/20'
                    : 'bg-gradient-to-br from-purple-500 to-purple-600 text-white'
                }`}>
                  <Users className="h-10 w-10" />
                </div>
                <span className="font-bold text-xl">Manage Leads</span>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  selectedAction === 'manage-leads'
                    ? 'opacity-90 bg-white/20'
                    : 'opacity-70 bg-blue-50'
                }`}>
                  Advanced view
                </span>
              </Button>
            </div>
            
            {/* 提示信息 */}
            {showNoLeadsMessage && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Please select one or more prospects to generate messages</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prospects List */}
        <Card className="business-card">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-blue-800 text-xl">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
                <Users className="h-5 w-5" />
              </div>
              Your Prospects ({leads.length})
            </CardTitle>
            <CardDescription className="text-blue-600 text-base">
              Select prospects to generate personalized messages
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">No Prospects Yet</h3>
                <p className="text-blue-600 mb-6 text-lg">Add your first prospect to get started</p>
                <Button 
                  onClick={() => setShowLeadForm(true)}
                  className="business-button"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Prospect
                </Button>
              </div>
            ) : (
              <SimplifiedLeadsTable 
                leads={leads}
                selectedLeads={selectedLeads}
                onSelectionChange={setSelectedLeads}
                onGenerateMessage={handleGenerateMessage}
                isGenerating={isGenerating}
              />
            )}
          </CardContent>
        </Card>

        {/* Message Generator Modal */}
        {showMessageGenerator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-blue-900">
                    {isBulkMode ? 'Generate Bulk Messages' : 'Generate Personalized Message'}
                  </h2>
                  <Button
                    onClick={() => setShowMessageGenerator(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                {isBulkMode ? (
                  <p className="text-blue-600 mt-2">
                    Generating messages for <span className="font-semibold">{selectedLeads.length} selected prospects</span>
                  </p>
                ) : selectedLeadForMessage && (
                  <p className="text-blue-600 mt-2">
                    Generating message for: <span className="font-semibold">{selectedLeadForMessage.name}</span>
                    {selectedLeadForMessage.company && ` at ${selectedLeadForMessage.company}`}
                  </p>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                {/* Lead Selection (if multiple leads selected) */}
                {selectedLeads.length > 1 && !selectedLeadForMessage && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Select a prospect to generate message for:
                    </label>
                    <div className="grid gap-2">
                      {selectedLeads.map((leadId) => {
                        const lead = leads.find((l: Lead) => l.id === leadId);
                        return lead ? (
                          <Button
                            key={leadId}
                            onClick={() => setSelectedLeadForMessage(lead)}
                            variant="outline"
                            className="justify-start text-left h-auto p-4"
                          >
                            <div>
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-sm text-gray-600">{lead.role}</div>
                              {lead.company && (
                                <div className="text-sm text-gray-500">{lead.company}</div>
                              )}
                            </div>
                          </Button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Message Settings */}
                {(selectedLeadForMessage || isBulkMode) && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custom Context (Optional)
                        </label>
                        <textarea
                          value={customContext}
                          onChange={(e) => setCustomContext(e.target.value)}
                          placeholder="Add any specific context, requirements, or notes for the message generation..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Style
                          </label>
                          <select
                            value={messageStyle}
                            onChange={(e) => setMessageStyle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="professional">Professional</option>
                            <option value="friendly">Friendly</option>
                            <option value="casual">Casual</option>
                            <option value="formal">Formal</option>
                            <option value="enthusiastic">Enthusiastic</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Target
                          </label>
                          <select
                            value={messageTarget}
                            onChange={(e) => setMessageTarget(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="connection">Connection Request</option>
                            <option value="business">Business Opportunity</option>
                            <option value="recruitment">Recruitment</option>
                            <option value="networking">Networking</option>
                            <option value="event">Event Invitation</option>
                            <option value="collaboration">Collaboration</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message Length
                          </label>
                          <select
                            value={messageLength}
                            onChange={(e) => setMessageLength(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="short">Short (100-200 chars)</option>
                            <option value="standard">Standard (200-400 chars)</option>
                            <option value="detailed">Detailed (400-500 chars)</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-3 pt-8">
                          <input
                            type="checkbox"
                            id="includeEmojis"
                            checked={includeEmojis}
                            onChange={(e) => setIncludeEmojis(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="includeEmojis" className="text-sm font-medium text-gray-700">
                            Include emojis
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        onClick={() => setShowMessageGenerator(false)}
                        variant="outline"
                        className="px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCustomMessageGenerate}
                        disabled={isGenerating}
                        className="business-button px-6"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          isBulkMode ? 'Generate Bulk Messages' : 'Generate Message'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generated Message Display */}
        {generatedMessage && (
          <div ref={resultRef} className="result-highlight p-8 rounded-2xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-white">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Generated Message</h2>
              </div>
              <div className="bg-white p-8 rounded-xl border border-blue-200 shadow-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                  {generatedMessage}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full font-medium">
                  Characters: {generatedMessage.length}
                </div>
                <Button 
                  onClick={() => navigator.clipboard.writeText(generatedMessage)}
                  className="business-button px-8 py-3"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Message
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
