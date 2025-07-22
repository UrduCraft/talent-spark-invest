import { useState } from "react";
import { Heart, MessageCircle, Share2, DollarSign, TrendingUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
    verified?: boolean;
  };
  content: string;
  type: "need" | "investment" | "regular";
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  goal?: number;
  raised?: number;
  investors?: number;
  tags?: string[];
}

const PostCard = ({ 
  author, 
  content, 
  type, 
  timestamp, 
  likes, 
  comments, 
  shares,
  goal,
  raised,
  investors,
  tags 
}: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const getTypeColor = () => {
    switch (type) {
      case "need":
        return "donation";
      case "investment":
        return "investment";
      default:
        return "secondary";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "need":
        return "Need Support";
      case "investment":
        return "Investment Opportunity";
      default:
        return "Post";
    }
  };

  return (
    <Card className="w-full shadow-card hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground">{author.name}</h3>
                {author.verified && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{author.title}</p>
              <p className="text-xs text-muted-foreground">{timestamp}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getTypeColor() === "donation" ? "secondary" : "default"} 
                   className={`${getTypeColor() === "donation" ? "bg-donation text-donation-foreground" : 
                              getTypeColor() === "investment" ? "bg-investment text-investment-foreground" : ""}`}>
              {getTypeLabel()}
            </Badge>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-foreground leading-relaxed mb-4">{content}</p>
        
        {tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {(type === "need" || type === "investment") && goal && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {type === "need" ? "Funding Goal" : "Investment Target"}
              </span>
              <span className="text-sm text-muted-foreground">
                ${raised?.toLocaleString()} / ${goal.toLocaleString()}
              </span>
            </div>
            <Progress value={(raised || 0) / goal * 100} className="mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round((raised || 0) / goal * 100)}% funded</span>
              {investors && <span>{investors} {type === "need" ? "donors" : "investors"}</span>}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? "text-red-500" : "text-muted-foreground"} hover:text-red-500 text-xs sm:text-sm`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              {comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs sm:text-sm">
              <Share2 className="w-4 h-4 mr-1" />
              {shares}
            </Button>
          </div>
          
          {type === "need" && (
            <Button variant="donation" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              <Heart className="w-4 h-4 mr-1" />
              Donate
            </Button>
          )}
          
          {type === "investment" && (
            <Button variant="investment" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Invest
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;