'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Lead } from '@/lib/supabase'
import { useUpdateLead, useDeleteLead } from '@/hooks/use-leads'

interface LeadsTableProps {
  leads: Lead[]
  onEdit: (lead: Lead) => void
}

export function LeadsTable({ leads, onEdit }: LeadsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Lead>>({})
  
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id)
    setEditData(lead)
  }

  const handleSave = async (id: string) => {
    try {
      await updateLead.mutateAsync({ id, data: editData })
      setEditingId(null)
      setEditData({})
    } catch (error) {
      console.error('Failed to update lead:', error)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete lead:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Draft: 'secondary',
      Approved: 'default',
      Sent: 'destructive',
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    {editingId === lead.id ? (
                      <Input
                        value={editData.name || lead.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      lead.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === lead.id ? (
                      <Input
                        value={editData.role || lead.role}
                        onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                      />
                    ) : (
                      lead.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === lead.id ? (
                      <Input
                        value={editData.company || lead.company}
                        onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                      />
                    ) : (
                      lead.company
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === lead.id ? (
                      <select
                        value={editData.status || lead.status}
                        onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as 'Draft' | 'Approved' | 'Sent' }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Approved">Approved</option>
                        <option value="Sent">Sent</option>
                      </select>
                    ) : (
                      getStatusBadge(lead.status)
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">
                      {lead.message || 'No message generated'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editingId === lead.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(lead.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(lead)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onEdit(lead)}>
                          Generate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(lead.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 