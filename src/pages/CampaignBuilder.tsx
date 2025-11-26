import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Image,
  Share2,
  DollarSign,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Upload,
  Calendar,
  Target,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import type { CampaignDraft } from '@/types';

const steps = [
  { id: 'brief', label: 'Brief', icon: FileText },
  { id: 'creatives', label: 'Creatives', icon: Image },
  { id: 'distribution', label: 'Distribution', icon: Share2 },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

const categories = [
  'Fashion', 'Technology', 'Health & Fitness', 'Beauty', 'Food',
  'Travel', 'Lifestyle', 'Gaming', 'Education', 'Business'
];

const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];
const regionOptions = ['United States', 'Europe', 'Asia Pacific', 'Latin America', 'Global'];

const initialDraft: CampaignDraft = {
  brief: {
    title: '',
    description: '',
    category: '',
    requirements: [],
    deliverables: [],
  },
  creatives: {
    guidelines: '',
    examples: [],
    doList: [],
    dontList: [],
  },
  distribution: {
    platforms: [],
    targetAudience: '',
    regions: [],
    timeline: {
      start: '',
      end: '',
    },
  },
  budget: {
    total: 5000,
    perCreator: 500,
    escrowEnabled: true,
    milestones: [
      { name: 'Content Draft', percentage: 30 },
      { name: 'Final Approval', percentage: 40 },
      { name: 'Campaign Complete', percentage: 30 },
    ],
  },
};

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<CampaignDraft>(initialDraft);
  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newDo, setNewDo] = useState('');
  const [newDont, setNewDont] = useState('');

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: 'Campaign Created!',
      description: 'Your campaign has been submitted for review.',
    });
    navigate('/dashboard');
  };

  const addItem = (
    field: 'requirements' | 'deliverables',
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setDraft(prev => ({
        ...prev,
        brief: {
          ...prev.brief,
          [field]: [...prev.brief[field], value.trim()],
        },
      }));
      setter('');
    }
  };

  const removeItem = (field: 'requirements' | 'deliverables', index: number) => {
    setDraft(prev => ({
      ...prev,
      brief: {
        ...prev.brief,
        [field]: prev.brief[field].filter((_, i) => i !== index),
      },
    }));
  };

  const togglePlatform = (platform: string) => {
    setDraft(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        platforms: prev.distribution.platforms.includes(platform)
          ? prev.distribution.platforms.filter(p => p !== platform)
          : [...prev.distribution.platforms, platform],
      },
    }));
  };

  const toggleRegion = (region: string) => {
    setDraft(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        regions: prev.distribution.regions.includes(region)
          ? prev.distribution.regions.filter(r => r !== region)
          : [...prev.distribution.regions, region],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Campaign</h1>
          <p className="text-muted-foreground">
            Build your perfect influencer campaign step by step
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs hidden sm:block">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Brief */}
            {currentStep === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Brief</CardTitle>
                  <CardDescription>
                    Define the core details of your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Fashion Collection Launch"
                      value={draft.brief.title}
                      onChange={(e) => setDraft(prev => ({
                        ...prev,
                        brief: { ...prev.brief, title: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={draft.brief.category}
                      onValueChange={(value) => setDraft(prev => ({
                        ...prev,
                        brief: { ...prev.brief, category: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign goals and what you're looking for..."
                      rows={4}
                      value={draft.brief.description}
                      onChange={(e) => setDraft(prev => ({
                        ...prev,
                        brief: { ...prev.brief, description: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Requirements</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a requirement..."
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem('requirements', newRequirement, setNewRequirement)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addItem('requirements', newRequirement, setNewRequirement)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {draft.brief.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {req}
                          <button
                            onClick={() => removeItem('requirements', index)}
                            className="ml-1 p-0.5 hover:bg-muted rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Deliverables</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a deliverable..."
                        value={newDeliverable}
                        onChange={(e) => setNewDeliverable(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem('deliverables', newDeliverable, setNewDeliverable)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => addItem('deliverables', newDeliverable, setNewDeliverable)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {draft.brief.deliverables.map((del, index) => (
                        <Badge key={index} variant="secondary" className="pr-1">
                          {del}
                          <button
                            onClick={() => removeItem('deliverables', index)}
                            className="ml-1 p-0.5 hover:bg-muted rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Creatives */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Creative Guidelines</CardTitle>
                  <CardDescription>
                    Set expectations for content creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="guidelines">Brand Guidelines</Label>
                    <Textarea
                      id="guidelines"
                      placeholder="Describe your brand voice, style preferences, and any specific guidelines..."
                      rows={4}
                      value={draft.creatives.guidelines}
                      onChange={(e) => setDraft(prev => ({
                        ...prev,
                        creatives: { ...prev.creatives, guidelines: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reference Examples</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag & drop files or click to upload
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-success">Do's</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a do..."
                          value={newDo}
                          onChange={(e) => setNewDo(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (newDo.trim()) {
                              setDraft(prev => ({
                                ...prev,
                                creatives: {
                                  ...prev.creatives,
                                  doList: [...prev.creatives.doList, newDo.trim()]
                                }
                              }));
                              setNewDo('');
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <ul className="space-y-1">
                        {draft.creatives.doList.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-success">
                            <CheckCircle className="w-4 h-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-destructive">Don'ts</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a don't..."
                          value={newDont}
                          onChange={(e) => setNewDont(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (newDont.trim()) {
                              setDraft(prev => ({
                                ...prev,
                                creatives: {
                                  ...prev.creatives,
                                  dontList: [...prev.creatives.dontList, newDont.trim()]
                                }
                              }));
                              setNewDont('');
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <ul className="space-y-1">
                        {draft.creatives.dontList.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-destructive">
                            <X className="w-4 h-4" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Distribution */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Settings</CardTitle>
                  <CardDescription>
                    Define where and when your campaign runs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {platformOptions.map((platform) => (
                        <Badge
                          key={platform}
                          variant={draft.distribution.platforms.includes(platform) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => togglePlatform(platform)}
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Regions</Label>
                    <div className="flex flex-wrap gap-2">
                      {regionOptions.map((region) => (
                        <Badge
                          key={region}
                          variant={draft.distribution.regions.includes(region) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleRegion(region)}
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Textarea
                      id="audience"
                      placeholder="Describe your ideal audience demographics, interests, and behaviors..."
                      rows={3}
                      value={draft.distribution.targetAudience}
                      onChange={(e) => setDraft(prev => ({
                        ...prev,
                        distribution: { ...prev.distribution, targetAudience: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="start-date"
                          type="date"
                          className="pl-10"
                          value={draft.distribution.timeline.start}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            distribution: {
                              ...prev.distribution,
                              timeline: { ...prev.distribution.timeline, start: e.target.value }
                            }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="end-date"
                          type="date"
                          className="pl-10"
                          value={draft.distribution.timeline.end}
                          onChange={(e) => setDraft(prev => ({
                            ...prev,
                            distribution: {
                              ...prev.distribution,
                              timeline: { ...prev.distribution.timeline, end: e.target.value }
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Budget */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Budget & Payments</CardTitle>
                  <CardDescription>
                    Set your budget and payment structure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Total Budget</Label>
                      <span className="text-2xl font-bold">${draft.budget.total.toLocaleString()}</span>
                    </div>
                    <Slider
                      value={[draft.budget.total]}
                      onValueChange={([value]) => setDraft(prev => ({
                        ...prev,
                        budget: { ...prev.budget, total: value }
                      }))}
                      max={50000}
                      min={500}
                      step={500}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>$500</span>
                      <span>$50,000</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Budget Per Creator</Label>
                      <span className="text-lg font-semibold">${draft.budget.perCreator}</span>
                    </div>
                    <Slider
                      value={[draft.budget.perCreator]}
                      onValueChange={([value]) => setDraft(prev => ({
                        ...prev,
                        budget: { ...prev.budget, perCreator: value }
                      }))}
                      max={5000}
                      min={100}
                      step={50}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                    <div>
                      <Label className="text-base">Enable Escrow Protection</Label>
                      <p className="text-sm text-muted-foreground">
                        Secure payments until deliverables are approved
                      </p>
                    </div>
                    <Switch
                      checked={draft.budget.escrowEnabled}
                      onCheckedChange={(checked) => setDraft(prev => ({
                        ...prev,
                        budget: { ...prev.budget, escrowEnabled: checked }
                      }))}
                    />
                  </div>

                  {draft.budget.escrowEnabled && (
                    <div className="space-y-4">
                      <Label>Payment Milestones</Label>
                      {draft.budget.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          <div className="flex-1">
                            <p className="font-medium">{milestone.name}</p>
                          </div>
                          <Badge variant="secondary">{milestone.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Campaign</CardTitle>
                  <CardDescription>
                    Double-check your campaign details before launching
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold mb-2">Campaign Brief</h3>
                      <p className="text-lg font-medium">{draft.brief.title || 'Untitled Campaign'}</p>
                      <Badge variant="secondary" className="mt-2">{draft.brief.category || 'No category'}</Badge>
                      <p className="text-muted-foreground mt-2">{draft.brief.description || 'No description provided'}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h3 className="font-semibold mb-2">Platforms</h3>
                        <div className="flex flex-wrap gap-1">
                          {draft.distribution.platforms.length > 0 ? (
                            draft.distribution.platforms.map((p) => (
                              <Badge key={p} variant="secondary">{p}</Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">No platforms selected</span>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-xl">
                        <h3 className="font-semibold mb-2">Budget</h3>
                        <p className="text-2xl font-bold">${draft.budget.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">${draft.budget.perCreator} per creator</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h3 className="font-semibold mb-2">Timeline</h3>
                      <p>
                        {draft.distribution.timeline.start && draft.distribution.timeline.end
                          ? `${draft.distribution.timeline.start} → ${draft.distribution.timeline.end}`
                          : 'No dates selected'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button variant="hero" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit}>
              Launch Campaign
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
