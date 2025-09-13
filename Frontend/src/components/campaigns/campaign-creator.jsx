"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { MessageSquare, Users, Send, Calendar, Clock, Sparkles } from "lucide-react"
import { MessageSuggestions } from "../ai/message-suggestions"

export function CampaignCreator({ segment, onCampaignCreated, onBack }) {
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    message: "",
    type: "email",
    scheduledFor: "now",
    scheduledDate: "",
    scheduledTime: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const messageTemplates = [
    {
      name: "Welcome Back",
      subject: "We miss you, {name}!",
      message:
        "Hi {name}, we noticed you haven't visited us in a while. Here's a special 15% discount just for you! Use code WELCOME15 at checkout.",
    },
    {
      name: "Exclusive Offer",
      subject: "Exclusive offer for our valued customers",
      message:
        "Hello {name}, as one of our premium customers, you get early access to our new collection with 20% off. Shop now before it's gone!",
    },
    {
      name: "Product Recommendation",
      subject: "Perfect products picked for you",
      message:
        "Hi {name}, based on your previous purchases, we think you'll love these new arrivals. Check them out and get free shipping on orders over ₹999!",
    },
  ]

  const handleInputChange = (field, value) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  const generatePersonalizedMessage = (template, customerName = "Customer") => {
    return template.replace(/\{name\}/g, customerName)
  }

  const handleCreateCampaign = async () => {
    setIsCreating(true)

    // Simulate campaign creation and delivery
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const campaign = {
      id: Date.now(),
      name: campaignData.name,
      subject: campaignData.subject,
      message: campaignData.message,
      type: campaignData.type,
      segmentId: segment.id,
      segmentName: segment.name,
      audienceSize: segment.audienceSize,
      status: campaignData.scheduledFor === "now" ? "sending" : "scheduled",
      createdAt: new Date().toISOString(),
      scheduledFor:
        campaignData.scheduledFor === "now" ? null : `${campaignData.scheduledDate} ${campaignData.scheduledTime}`,
      deliveryStats: {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: segment.audienceSize,
      },
    }

    onCampaignCreated(campaign)
    setIsCreating(false)
  }

  const handleAIMessageSelected = (subject, message) => {
    setCampaignData((prev) => ({
      ...prev,
      subject: subject,
      message: message,
    }))
    setShowAISuggestions(false)
  }

  const useTemplate = (template) => {
    setCampaignData((prev) => ({
      ...prev,
      subject: template.subject,
      message: template.message,
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-accent" />
            Create Campaign
          </h2>
          <p className="text-muted-foreground">Create a personalized campaign for your selected audience</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Segments
        </Button>
      </div>

      {/* Segment Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium">{segment.name}</p>
                <p className="text-sm text-muted-foreground">{segment.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {segment.audienceSize.toLocaleString()} customers
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant={showAISuggestions ? "default" : "outline"}
          onClick={() => setShowAISuggestions(!showAISuggestions)}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {showAISuggestions ? "Hide" : "Show"} AI Message Suggestions
        </Button>
      </div>

      {showAISuggestions && (
        <div className="animate-slide-in">
          <MessageSuggestions onMessageSelected={handleAIMessageSelected} segmentInfo={segment} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Holiday Sale Campaign"
                    value={campaignData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select value={campaignData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-subject">Subject Line *</Label>
                <Input
                  id="campaign-subject"
                  placeholder="Enter your subject line..."
                  value={campaignData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-message">Message *</Label>
                <Textarea
                  id="campaign-message"
                  placeholder="Write your personalized message here... Use {name} for personalization."
                  value={campaignData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">Tip: Use {"{name}"} in your message for personalization</p>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>When to send</Label>
                <Select
                  value={campaignData.scheduledFor}
                  onValueChange={(value) => handleInputChange("scheduledFor", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send immediately</SelectItem>
                    <SelectItem value="scheduled">Schedule for later</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {campaignData.scheduledFor === "scheduled" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-date">Date</Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={campaignData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-time">Time</Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={campaignData.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Templates & Preview */}
        <div className="space-y-6">
          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {messageTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3 bg-transparent"
                  onClick={() => useTemplate(template)}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{template.subject}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaignData.subject && (
                <div>
                  <Label className="text-xs text-muted-foreground">Subject</Label>
                  <p className="text-sm font-medium">{generatePersonalizedMessage(campaignData.subject, "John Doe")}</p>
                </div>
              )}

              {campaignData.message && (
                <div>
                  <Label className="text-xs text-muted-foreground">Message</Label>
                  <div className="text-sm p-3 bg-muted/30 rounded-lg border">
                    {generatePersonalizedMessage(campaignData.message, "John Doe")}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {campaignData.scheduledFor === "now"
                    ? "Sending immediately"
                    : campaignData.scheduledDate
                      ? `Scheduled for ${campaignData.scheduledDate} ${campaignData.scheduledTime}`
                      : "Not scheduled"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Campaign Button */}
          <Button
            onClick={handleCreateCampaign}
            disabled={!campaignData.name || !campaignData.subject || !campaignData.message || isCreating}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Creating Campaign...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Create & Send Campaign
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
