'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeads } from '@/hooks/use-leads';
import { useGenerateMessage } from '@/hooks/use-message-generation';
import { useCreateMessage } from '@/hooks/use-messages';
import { Lead, CreateLeadData } from '@/lib/supabase';
import { AdvancedMessageGenerator } from '@/components/advanced-message-generator';
import { MessageSettings } from '@/components/message-settings';
import { LinkedInAnalyzer } from '@/components/linkedin-analyzer';
import { TemplateSelector } from '@/components/template-selector';
import { LeadForm } from '@/components/lead-form';
import { MessageHistory } from '@/components/message-history';
import { UserPreferences, MessageTemplate } from '@/types/message';
import { MessageTemplate as TemplateType } from '@/lib/message-templates';
import { LinkedInProfile } from '@/lib/linkedin-parser';
import { MessageSquare, Users, Plus, Sparkles, Target, TrendingUp, Building2, UserPlus } from 'lucide-react';

export default function Home() {
  // State management
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);
  const [isAddingLead, setIsAddingLead] = useState<boolean>(false);
  const [generatingLeadId, setGeneratingLeadId] = useState<string | null>(null);
  const { data: leadsData, isLoading, error, refetch } = useLeads();
  const { mutate: generateMessage } = useGenerateMessage();
  const createMessage = useCreateMessage();
  
  // Refs for auto-scrolling
  const resultRef = useRef<HTMLDivElement>(null);
  const generatorRef = useRef<HTMLDivElement>(null);
  
  // Default user preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    default_style: 'professional',
    default_target: 'connection',
    preferred_length: 'standard',
    include_emojis: false,
    auto_save_templates: true,
    show_character_count: true
  });

  // Example templates
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Technology Industry Connection',
      content: 'Hi {name}, I noticed your work at {company} and was impressed by your expertise in {role}. Would love to connect and discuss industry trends!',
      style: 'professional',
      target: 'connection',
      industry: 'technology',
      is_default: true,
      created_at: new Date().toISOString()
    }
  ]);

  const leads = leadsData?.leads || [];

  // Auto-scroll to result when message is generated
  useEffect(() => {
    if (generatedMessage && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [generatedMessage]);

  // Auto-detect and handle Chinese content
  useEffect(() => {
    if (leads.length > 0) {
      const leadsWithChinese = leads.filter((lead: Lead) => lead.role === 'HR总监');
      if (leadsWithChinese.length > 0) {
        console.log('Detected Chinese content in leads:', leadsWithChinese);
        // In a real app, you would update these via API
        // For now, we'll just log them
      }
    }
  }, [leads]);

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
        // Refresh leads data
        await refetch();
        setShowLeadForm(false);
        // Show success message
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

  // Function to fix Chinese content in leads
  const fixChineseContent = async () => {
    try {
      // Check if there are any leads with Chinese content
      const leadsWithChinese = leads.filter((lead: Lead) => lead.role === 'HR总监');
      
      if (leadsWithChinese.length > 0) {
        console.log('Found leads with Chinese content, updating...');
        
        // For now, just log the issue - in a real app, you would update via API
        leadsWithChinese.forEach((lead: Lead) => {
          console.log(`Lead ${lead.id} has Chinese role: ${lead.role}`);
        });
        
        // Refresh leads data
        await refetch();
      }
    } catch (error) {
      console.error('Error checking Chinese content:', error);
    }
  };

  const handleGenerateMessage = async (lead: Lead) => {
    setSelectedLead(lead);
    setGeneratedMessage(''); // Clear previous message
            setGeneratingLeadId(lead.id); // Set current generating lead ID
    
    generateMessage({
      name: lead.name,
      company: lead.company,
      role: lead.role,
      industry: '',
      style: 'professional',
      target: 'connection',
      length: 'standard',
      include_emojis: false
    });
  };

  const handleTemplateSelected = (template: TemplateType, filledContent: string) => {
    console.log('Template selected:', template, filledContent);
  };

  const handleTemplateApplied = (content: string) => {
    console.log('Template applied:', content);
  };

  const handleProfileAnalyzed = (profile: LinkedInProfile) => {
    console.log('LinkedIn analysis:', profile);
  };

  const handleMessageGenerated = async (message: string) => {
    setGeneratedMessage(message);
    setGeneratingLeadId(null); // Clear generation status

    // Save message to database
    if (selectedLead) {
      try {
        await createMessage.mutateAsync({
          lead_id: selectedLead.id,
          content: message,
          status: 'Draft',
          template_used: 'AI Generated',
          ai_model: 'GPT-4',
          character_count: message.length,
          generated_at: new Date().toISOString()
        });
        console.log('Message saved to database');
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }
  };

  const handleTemplateSave = (template: Omit<MessageTemplate, 'id' | 'created_at'>) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleTemplateDelete = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-blue-600 font-medium">Loading prospect data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <p className="text-red-600 font-medium">Loading failed: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Business Style Header */}
      <div className="business-header py-6 px-6">
        <div className="container mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-full">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">LinkedIn Smart Message Generator</h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Generate personalized, professional LinkedIn messages for your prospects using AI technology to enhance business communication
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-blue-100">
              <Sparkles className="h-5 w-5" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Target className="h-5 w-5" />
              <span>Precision Targeting</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <TrendingUp className="h-5 w-5" />
              <span>Boost Conversions</span>
            </div>
          </div>
        </div>
      </div>

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
                <LeadForm 
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prospects List */}
          <Card className="business-card">
            <CardHeader className="border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Users className="h-5 w-5" />
                Your Prospects ({leads.length})
              </CardTitle>
              <CardDescription className="text-blue-600">
                Select a prospect to start generating personalized messages
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {leads.length === 0 ? (
                <div className="text-center py-6">
                  <div className="p-3 bg-blue-50 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-blue-900 mb-2">No Prospects Yet</h3>
                  <p className="text-blue-600 mb-4">Add your first prospect to get started</p>
                  <Button 
                    onClick={() => setShowLeadForm(true)}
                    className="business-button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Prospect
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads?.map((lead: Lead) => {
                    const isGeneratingForThisLead = generatingLeadId === lead.id;
                    const displayRole = lead.role === 'HR总监' ? 'HR Director' : lead.role;
                    return (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-900">{lead.name}</div>
                            <div className="text-sm text-blue-600">{displayRole} at {lead.company}</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          disabled={isGeneratingForThisLead}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateMessage(lead);
                          }}
                          className="business-button"
                        >
                          {isGeneratingForThisLead ? 'Generating...' : 'Generate Message'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Message History */}
          <div className="lg:col-span-2">
            <MessageHistory selectedLead={selectedLead} />
          </div>
        </div>

        {/* Right Side Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MessageSettings 
            preferences={userPreferences}
            onPreferencesChange={setUserPreferences}
            templates={templates}
            onTemplateSave={handleTemplateSave}
            onTemplateDelete={handleTemplateDelete}
          />
          <TemplateSelector 
            onTemplateSelected={handleTemplateSelected}
            onTemplateApplied={handleTemplateApplied}
          />
          {selectedLead && (
            <LinkedInAnalyzer 
              lead={selectedLead}
              onProfileAnalyzed={handleProfileAnalyzed}
            />
          )}
        </div>

        {/* Advanced Message Generator */}
        {selectedLead && (
          <div ref={generatorRef}>
            <AdvancedMessageGenerator 
              lead={selectedLead}
              onMessageGenerated={handleMessageGenerated}
            />
          </div>
        )}

        {/* Generated Message Display */}
        {generatedMessage && (
          <div ref={resultRef} className="result-highlight p-6 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">Generated Message</h2>
              </div>
              <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {generatedMessage}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-blue-600">
                  Characters: {generatedMessage.length}
                </div>
                <Button 
                  onClick={() => navigator.clipboard.writeText(generatedMessage)}
                  className="business-button"
                >
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
