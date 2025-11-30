import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { campaignsApi, contractsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Campaign } from '@/types';

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [proposal, setProposal] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');

  useEffect(() => {
    const loadCampaign = async () => {
      if (!id) return;
      try {
        const data = await campaignsApi.getById(id);
        setCampaign(data);
      } catch (error) {
        console.error('Failed to load campaign:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCampaign();
  }, [id]);

  const handleApply = async () => {
    if (!campaign || !user) return;
    
    setIsApplying(true);
    try {
      await contractsApi.create({
        creatorId: user.id,
        campaignId: campaign.id,
        title: `Application for ${campaign.title}`,
        terms: proposal || 'Application to work on this campaign',
        amount: parseFloat(proposedAmount) || campaign.budget,
        currency: 'USD',
      });

      toast({
        title: 'Application submitted!',
        description: 'The brand will review your application.',
      });
      
      setIsDialogOpen(false);
      setProposal('');
      setProposedAmount('');
    } catch (error: any) {
      toast({
        title: 'Application failed',
        description: error.response?.data?.message || 'Failed to submit application',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{campaign.title}</CardTitle>
                  <Badge>{campaign.status}</Badge>
                </div>
                {user?.role === 'creator' || user?.role === 'CREATOR' ? (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg">Apply to Campaign</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply to {campaign.title}</DialogTitle>
                        <DialogDescription>
                          Submit your proposal to work on this campaign
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="proposal">Your Proposal</Label>
                          <Textarea
                            id="proposal"
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            placeholder="Explain why you're a good fit for this campaign..."
                            rows={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Proposed Amount (USD)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={proposedAmount}
                            onChange={(e) => setProposedAmount(e.target.value)}
                            placeholder={campaign.budget.toString()}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Campaign budget: ${campaign.budget}
                          </p>
                        </div>
                        <Button 
                          onClick={handleApply} 
                          disabled={isApplying}
                          className="w-full"
                        >
                          {isApplying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{campaign.description}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                  </div>
                </div>
                {campaign.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-semibold">{new Date(campaign.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold">{campaign.status}</p>
                  </div>
                </div>
              </div>

              {campaign.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-muted-foreground">{campaign.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
