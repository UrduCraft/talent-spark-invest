import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Users, Calendar, Shield, Star } from "lucide-react";

interface InvestmentModalProps {
  trigger: React.ReactNode;
  projectTitle: string;
  projectDescription: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  minimumInvestment: number;
  expectedReturn: string;
  timeframe: string;
  riskLevel: "Low" | "Medium" | "High";
}

const InvestmentModal = ({
  trigger,
  projectTitle,
  projectDescription,
  targetAmount,
  currentAmount,
  investorCount,
  minimumInvestment,
  expectedReturn,
  timeframe,
  riskLevel
}: InvestmentModalProps) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [investorMessage, setInvestorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const progressPercentage = (currentAmount / targetAmount) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-investment text-investment-foreground";
      case "Medium": return "bg-yellow-500 text-white";
      case "High": return "bg-red-500 text-white";
      default: return "bg-secondary";
    }
  };

  const handleInvest = () => {
    // Investment logic would go here
    console.log("Investment:", { investmentAmount, investorMessage });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[95%] sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-investment" />
            Investment Opportunity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{projectTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{projectDescription}</p>
              
              {/* Investment Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>${currentAmount.toLocaleString()} / ${targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progressPercentage)}% funded</span>
                  <span>{investorCount} investors</span>
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-investment" />
                    <div>
                      <p className="text-xs text-muted-foreground">Minimum Investment</p>
                      <p className="font-semibold">${minimumInvestment.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Return</p>
                      <p className="font-semibold">{expectedReturn}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Timeframe</p>
                      <p className="font-semibold">{timeframe}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Level</p>
                      <Badge className={getRiskColor(riskLevel)}>{riskLevel}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Make Your Investment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Investment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Minimum: ${minimumInvestment}`}
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  min={minimumInvestment}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum investment: ${minimumInvestment.toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message to Project Owner (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Share your thoughts, expertise, or how you can help beyond the investment..."
                  value={investorMessage}
                  onChange={(e) => setInvestorMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Investment Summary */}
              {investmentAmount && Number(investmentAmount) >= minimumInvestment && (
                <div className="bg-investment/5 border border-investment/20 rounded-lg p-4">
                  <h4 className="font-semibold text-investment mb-2">Investment Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Investment Amount:</span>
                      <span className="font-semibold">${Number(investmentAmount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Return ({expectedReturn}):</span>
                      <span className="font-semibold text-investment">
                        ${(Number(investmentAmount) * 1.2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeframe:</span>
                      <span>{timeframe}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="investment" 
                  className="flex-1"
                  onClick={handleInvest}
                  disabled={!investmentAmount || Number(investmentAmount) < minimumInvestment}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Invest ${investmentAmount ? Number(investmentAmount).toLocaleString() : "0"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentModal;