import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Image, Video, Calendar, DollarSign, TrendingUp, X } from "lucide-react";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("regular");
  const [goal, setGoal] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card className="w-full shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Tabs value={postType} onValueChange={setPostType} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="regular">Regular Post</TabsTrigger>
                <TabsTrigger value="need" className="text-donation">Need Support</TabsTrigger>
                <TabsTrigger value="investment" className="text-investment">Investment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="regular" className="space-y-4">
                <Textarea
                  placeholder="What's on your mind? Share your thoughts, achievements, or professional updates..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px] resize-none border-none shadow-none text-base placeholder:text-muted-foreground"
                />
              </TabsContent>
              
              <TabsContent value="need" className="space-y-4">
                <Textarea
                  placeholder="Describe your need and how the community can help you achieve your goals..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px] resize-none border-none shadow-none text-base placeholder:text-muted-foreground"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal">Funding Goal ($)</Label>
                    <Input
                      id="goal"
                      type="number"
                      placeholder="5000"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="investment" className="space-y-4">
                <Textarea
                  placeholder="Present your investment opportunity. Describe your project, expected returns, and why investors should believe in you..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="min-h-[120px] resize-none border-none shadow-none text-base placeholder:text-muted-foreground"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target">Investment Target ($)</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="50000"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Tags Section */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    #{tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4 mr-1" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4 mr-1" />
                  Video
                </Button>
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Event
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                {postType === "need" && (
                  <Button variant="donation" disabled={!postContent.trim()}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    Post Need
                  </Button>
                )}
                {postType === "investment" && (
                  <Button variant="investment" disabled={!postContent.trim()}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Post Opportunity
                  </Button>
                )}
                {postType === "regular" && (
                  <Button variant="premium" disabled={!postContent.trim()}>
                    Post
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;