'use client';

import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  FileText, 
  Shield, 
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  AlertCircle,
  DollarSign,
  Users,
  Briefcase,
  Coins,
  Calculator,
  Info
} from 'lucide-react';
import { formatCurrency } from '@/lib/stellar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ASSET_TYPES = [
  {
    id: 'game_project',
    name: 'Game Project',
    description: 'Full game development projects',
    icon: Building2,
    minValue: 50000,
    examples: ['RPG Games', 'Strategy Games', 'Action Games', 'Mobile Games']
  },
  {
    id: 'in_game_assets',
    name: 'In-Game Assets',
    description: 'Unique items, characters, and collectibles',
    icon: Coins,
    minValue: 1000,
    examples: ['Character Skins', 'Rare Items', 'Special Equipment', 'Collectible Sets']
  },
  {
    id: 'beta_access',
    name: 'Beta Access',
    description: 'Early access rights and testing privileges',
    icon: Shield,
    minValue: 5000,
    examples: ['Alpha Testing', 'Beta Testing', 'Early Access', 'Development Updates']
  }
];

const TOKENIZATION_STEPS = [
  {
    id: 'project_info',
    title: 'Game Details',
    description: 'Enter basic information about your game project',
    icon: FileText,
    bgColor: 'from-primary/10 to-primary/5'
  },
  {
    id: 'technical_specs',
    title: 'Technical Specs',
    description: 'Provide technical details and game mechanics',
    icon: Calculator,
    bgColor: 'from-secondary/10 to-secondary/5'
  },
  {
    id: 'licensing',
    title: 'Licensing',
    description: 'Set up IP rights and usage terms',
    icon: Shield,
    bgColor: 'from-primary/10 to-secondary/10'
  },
  {
    id: 'tokenomics',
    title: 'Game Economics',
    description: 'Define token distribution and pricing',
    icon: Coins,
    bgColor: 'from-secondary/10 to-primary/10'
  },
  {
    id: 'launch',
    title: 'Launch Project',
    description: 'Review and deploy your game project',
    icon: Upload,
    bgColor: 'from-accent/10 to-accent/5'
  }
];

interface FormData {
  assetType: string;
  assetName: string;
  description: string;
  gameEngine?: string;
  platform?: string;
  genre?: string;
  playerCount?: string;
  features?: string;
  licenseType?: string;
  ipRights?: string;
  termsOfUse?: string;
  tokenSupply?: number;
  tokenPrice?: number;
  fundingGoal?: number;
  vestingPeriod?: number;
  distribution?: string;
  termsAccepted?: boolean;
}

export default function TokenizePage() {
  const { isConnected, address } = useWalletStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    assetType: '',
    assetName: '',
    description: ''
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOKENIZATION_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTokenomics = () => {
    if (!formData.totalValue || !formData.totalSupply) return null;
    
    const totalVal = parseFloat(formData.totalValue);
    const supply = parseFloat(formData.totalSupply);
    const pricePerToken = totalVal / supply;
    
    return {
      pricePerToken: pricePerToken.toFixed(2),
      marketCap: totalVal,
      minInvestmentTokens: formData.minInvestment ? Math.ceil(parseFloat(formData.minInvestment) / pricePerToken) : 0
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ASSET_TYPES.map((type) => (
                <div
                  key={type.id}
                  className={cn(
                    "gaming-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
                    formData.assetType === type.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setFormData({ ...formData, assetType: type.id })}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData({ ...formData, assetName: e.target.value })}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 p-2">
                      <type.icon className="w-full h-full text-primary" />
                    </div>
                    <div>
                      <h4 className="gaming-title text-sm font-medium">{type.name}</h4>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {type.examples.map((example) => (
                          <Badge key={example} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  placeholder="Enter your game's name"
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameDescription">Game Description</Label>
                <Textarea
                  id="gameDescription"
                  placeholder="Describe your game and its unique features"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="gaming-input min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gameEngine">Game Engine</Label>
                <Input
                  id="gameEngine"
                  placeholder="e.g., Unreal Engine, Unity"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Target Platform</Label>
                <Input
                  id="platform"
                  placeholder="e.g., PC, Mobile, Console"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Game Genre</Label>
                <Input
                  id="genre"
                  placeholder="e.g., RPG, Strategy, Action"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="playerCount">Player Count</Label>
                <Input
                  id="playerCount"
                  placeholder="e.g., Single-player, 2-4 players"
                  className="gaming-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Key Features</Label>
              <Textarea
                id="features"
                placeholder="List the main features and mechanics of your game"
                className="gaming-input min-h-[100px]"
              />
            </div>
          </div>
        );

      case 3:
        const tokenomics = calculateTokenomics();
        return (
          <div className="space-y-6">
            <Alert className="gaming-alert">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Make sure you have the rights to all assets and content in your game.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseType">License Type</Label>
                <Input
                  id="licenseType"
                  placeholder="e.g., Proprietary, Open Source"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipRights">IP Rights</Label>
                <Textarea
                  id="ipRights"
                  placeholder="Describe the intellectual property rights and ownership structure"
                  className="gaming-input min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsOfUse">Terms of Use</Label>
                <Textarea
                  id="termsOfUse"
                  placeholder="Define how token holders can use their assets"
                  className="gaming-input min-h-[100px]"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tokenSupply">Total Token Supply</Label>
                <Input
                  id="tokenSupply"
                  type="number"
                  placeholder="e.g., 1000000"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenPrice">Token Price (USDC)</Label>
                <Input
                  id="tokenPrice"
                  type="number"
                  placeholder="e.g., 1.00"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal (USDC)</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  placeholder="e.g., 100000"
                  className="gaming-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vestingPeriod">Vesting Period (months)</Label>
                <Input
                  id="vestingPeriod"
                  type="number"
                  placeholder="e.g., 12"
                  className="gaming-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distribution">Token Distribution</Label>
              <Textarea
                id="distribution"
                placeholder="Describe how tokens will be distributed (e.g., Team: 20%, Community: 30%, etc.)"
                className="gaming-input min-h-[100px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Alert className="gaming-alert">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Review all information carefully before launching your game project.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Card className="gaming-card bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">Game Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Game Name</p>
                      <p className="font-medium">{formData.assetName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Project Type</p>
                      <p className="font-medium capitalize">{formData.assetType.replace('_', ' ')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium">{formData.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="terms" className="gaming-checkbox" />
                <Label htmlFor="terms" className="text-sm">
                  I confirm that all information provided is accurate and I have the rights to tokenize this game project
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Wallet Required</h2>
              <p className="text-muted-foreground mb-4">
                Connect your wallet to start the tokenization process
              </p>
              <Button className="w-full">Connect Wallet</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Title */}
          <div className="gaming-container space-y-4">
            <h1 className="gaming-title text-4xl md:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Launch Your Game Project
            </h1>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Tokenize your game, secure funding, and build your community through blockchain technology
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-3xl mx-auto space-y-2">
            <Progress 
              value={(currentStep / TOKENIZATION_STEPS.length) * 100} 
              className="h-2 gaming-progress"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {TOKENIZATION_STEPS.length}</span>
              <span>{TOKENIZATION_STEPS[currentStep - 1].title}</span>
            </div>
          </div>

          {/* Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {TOKENIZATION_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "gaming-card relative group transition-all duration-300",
                    isActive && "scale-105 ring-2 ring-primary",
                    isCompleted && "opacity-50"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-20 rounded-lg",
                    step.bgColor
                  )} />
                  
                  <div className="relative p-4 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 p-2 mb-3 transition-transform group-hover:scale-110">
                      {isCompleted ? (
                        <Check className="w-full h-full text-green-500" />
                      ) : (
                        <step.icon className="w-full h-full text-primary" />
                      )}
                    </div>
                    <h3 className="gaming-title text-sm font-medium mb-1">{step.title}</h3>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Section */}
          <Card className="gaming-card max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="gaming-title text-2xl">
                {TOKENIZATION_STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {TOKENIZATION_STEPS[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between max-w-3xl mx-auto pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="gaming-button variant-outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Step
            </Button>
            
            <Button
              onClick={() => setCurrentStep(Math.min(TOKENIZATION_STEPS.length, currentStep + 1))}
              disabled={currentStep === TOKENIZATION_STEPS.length}
              className="gaming-button"
            >
              {currentStep === TOKENIZATION_STEPS.length ? (
                <>
                  Launch Project
                  <Upload className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function getStepName(step: number) {
  switch (step) {
    case 1: return 'Project Type';
    case 2: return 'Basic Info';
    case 3: return 'Details';
    case 4: return 'Tokenomics';
    case 5: return 'Review';
    default: return '';
  }
}