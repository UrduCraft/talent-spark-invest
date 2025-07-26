import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Wallet, Shield, Eye, ExternalLink } from "lucide-react";
import { useWeb3 } from "@/hooks/useWeb3";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CryptoInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    title: string;
    description: string;
    funding_goal_eth: number;
    current_amount_eth: number;
    minimum_investment_eth: number;
    expected_return_percentage: number;
    timeframe_months: number;
    risk_level: string;
  };
}

export const CryptoInvestmentModal = ({ isOpen, onClose, opportunity }: CryptoInvestmentModalProps) => {
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const { account, isConnected, connectWallet, sendTransaction } = useWeb3();
  const { toast } = useToast();

  // Platform wallet for receiving investments (in production, this should be your actual wallet)
  const PLATFORM_WALLET = "0x742C14d47b0C89d59F1E8aF3654C1aE7BaE3aa5a";

  const handleInvest = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) < opportunity.minimum_investment_eth) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment is ${opportunity.minimum_investment_eth} ETH`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsInvesting(true);

      // Send ETH transaction
      const tx = await sendTransaction(PLATFORM_WALLET, investmentAmount);
      
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash.slice(0, 10)}...`,
      });

      // Record transaction in database
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        const { data: transactionData } = await supabase.from('crypto_transactions').insert({
          transaction_hash: tx.hash,
          from_wallet: account!,
          to_wallet: PLATFORM_WALLET,
          amount_eth: parseFloat(investmentAmount),
          transaction_type: 'investment',
          opportunity_id: opportunity.id,
          user_id: user.user.id,
          status: 'pending'
        }).select().single();

        // Create investment record with transaction reference
        if (transactionData) {
          await supabase.from('investments').insert({
            user_id: user.user.id,
            opportunity_id: opportunity.id,
            amount_eth: parseFloat(investmentAmount),
            transaction_id: transactionData.id,
            message: message || null
          });
        }
      }

      // Wait for transaction confirmation
      await tx.wait();

      toast({
        title: "Investment Successful!",
        description: `You've invested ${investmentAmount} ETH successfully`,
      });

      onClose();
      setInvestmentAmount("");
      setMessage("");
    } catch (error: any) {
      console.error('Investment failed:', error);
      toast({
        title: "Investment Failed",
        description: error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsInvesting(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const progressPercentage = (opportunity.current_amount_eth / opportunity.funding_goal_eth) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-5 h-5 text-primary" />
            Crypto Investment - {opportunity.title}
          </DialogTitle>
          <DialogDescription>
            Transparent blockchain-based investment with full transaction visibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transparency Notice */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-medium text-primary">Full Transparency</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All transactions are recorded on the blockchain and in our database for complete transparency. 
              You can verify every transaction independently.
            </p>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="font-semibold mb-2">Project Overview</h3>
            <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expected Return:</span>
                  <span className="font-medium text-green-400">{opportunity.expected_return_percentage}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Timeframe:</span>
                  <span className="font-medium">{opportunity.timeframe_months} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge className={getRiskColor(opportunity.risk_level)}>{opportunity.risk_level}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Funding Goal:</span>
                  <span className="font-medium">{opportunity.funding_goal_eth} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Amount:</span>
                  <span className="font-medium">{opportunity.current_amount_eth} ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Min. Investment:</span>
                  <span className="font-medium">{opportunity.minimum_investment_eth} ETH</span>
                </div>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercentage.toFixed(1)}% funded
            </p>
          </div>

          <Separator />

          {/* Wallet Connection */}
          {!isConnected ? (
            <div className="text-center py-6">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your crypto wallet to make secure blockchain investments
              </p>
              <Button onClick={connectWallet} className="w-full">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <>
              {/* Connected Wallet Info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-green-400">Wallet Connected</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </div>

              {/* Investment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Investment Amount (ETH)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    min={opportunity.minimum_investment_eth}
                    placeholder={`Min: ${opportunity.minimum_investment_eth} ETH`}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Add a message to the project creator..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Investment Summary */}
              {investmentAmount && parseFloat(investmentAmount) >= opportunity.minimum_investment_eth && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium">Investment Summary</h4>
                  <div className="flex justify-between text-sm">
                    <span>Investment Amount:</span>
                    <span className="font-medium">{investmentAmount} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Expected Return:</span>
                    <span className="font-medium text-green-400">
                      +{((parseFloat(investmentAmount) * opportunity.expected_return_percentage) / 100).toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Expected:</span>
                    <span className="font-medium">
                      {(parseFloat(investmentAmount) * (1 + opportunity.expected_return_percentage / 100)).toFixed(4)} ETH
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isInvesting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvest}
                  className="flex-1"
                  disabled={isInvesting || !investmentAmount || parseFloat(investmentAmount) < opportunity.minimum_investment_eth}
                >
                  {isInvesting ? "Processing..." : "Invest with Crypto"}
                </Button>
              </div>

              {/* Transaction Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  All transactions are publicly verifiable on the blockchain
                </p>
                <p>Platform Wallet: {PLATFORM_WALLET.slice(0, 6)}...{PLATFORM_WALLET.slice(-4)}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};