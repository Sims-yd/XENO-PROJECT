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
    if (!segment) return // Guard against null segment
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

  // If no segment was passed (e.g., direct navigation), show a friendly placeholder
  if (!segment) {
    return (
      <div className="space-y-8 bg-gradient-to-br from-indigo-50 via-pink-50/40 to-yellow-50/30 p-6 md:p-10 rounded-xl min-h-screen flex flex-col items-center justify-center text-center">
        <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-600">
              No Segment Selected
            </h2>
            <p className="text-indigo-700/80 font-medium">
              You need to choose or create a segment before building a campaign.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-yellow-600 text-white font-semibold shadow"
              >
                Back to Segments
              </Button>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-indigo-50 via-pink-50/40 to-yellow-50/30 p-4 md:p-8 rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-300/30 via-pink-300/20 to-yellow-300/20 blur-2xl rounded-xl pointer-events-none" />
          <h2 className="relative text-3xl md:text-4xl font-extrabold flex items-center gap-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-600">
            <MessageSquare className="h-7 w-7 md:h-9 md:w-9 text-pink-500 drop-shadow" />
            Create Campaign
          </h2>
          <p className="relative mt-2 text-indigo-700/80 font-medium text-sm md:text-base">
            Create a personalized campaign for your selected audience.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="backdrop-blur-sm bg-white/60 border-indigo-200/60 hover:bg-white/80 text-indigo-700 font-medium"
        >
          Back to Segments
        </Button>
      </div>

      {/* Segment Info */}
      <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50">
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-200 via-pink-200 to-yellow-200 mix-blend-multiply" />
        <CardContent className="p-5 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 flex items-center justify-center shadow-md ring-2 ring-white/50">
                  <Users className="h-6 w-6 text-white drop-shadow" />
                </div>
                <div>
                  <p className="font-bold text-indigo-800 tracking-tight text-lg">{segment?.name || "Unnamed Segment"}</p>
                  <p className="text-xs md:text-sm text-indigo-700/70 font-medium max-w-md line-clamp-2">
                    {segment?.description || "No description provided."}
                  </p>
                </div>
              </div>
              <Badge className="text-xs md:text-sm font-semibold bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 text-white shadow">
                {(segment?.audienceSize || 0).toLocaleString()} customers
              </Badge>
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant={showAISuggestions ? "default" : "outline"}
          onClick={() => setShowAISuggestions(!showAISuggestions)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-yellow-600 text-white border-0 shadow-md hover:shadow-lg"
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Campaign Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-indigo-200 via-pink-200 to-yellow-200 mix-blend-multiply" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800 font-extrabold tracking-tight">
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name" className="text-indigo-700 font-semibold text-sm">
                    Campaign Name *
                  </Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Holiday Sale Campaign"
                    value={campaignData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border-indigo-200 focus-visible:ring-indigo-400/50 bg-white/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type" className="text-indigo-700 font-semibold text-sm">
                    Campaign Type
                  </Label>
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
                <Label htmlFor="campaign-subject" className="text-indigo-700 font-semibold text-sm">
                  Subject Line *
                </Label>
                <Input
                  id="campaign-subject"
                  placeholder="Enter your subject line..."
                  value={campaignData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="border-pink-200 focus-visible:ring-pink-400/50 bg-white/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-message" className="text-indigo-700 font-semibold text-sm">
                  Message *
                </Label>
                <Textarea
                  id="campaign-message"
                  placeholder="Write your personalized message here... Use {name} for personalization."
                  value={campaignData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-indigo-600/70 font-medium">
                  Tip: Use {"{name}"} in your message for personalization
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800 font-extrabold tracking-tight">
                <Calendar className="h-5 w-5 text-pink-500" />
                Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-indigo-700 font-semibold text-sm">When to send</Label>
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
                    <Label htmlFor="scheduled-date" className="text-indigo-700 font-semibold text-sm">
                      Date
                    </Label>
                    <Input
                      id="scheduled-date"
                      type="date"
                      value={campaignData.scheduledDate}
                      onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                      className="border-indigo-200 focus-visible:ring-indigo-400/50 bg-white/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled-time" className="text-indigo-700 font-semibold text-sm">
                      Time
                    </Label>
                    <Input
                      id="scheduled-time"
                      type="time"
                      value={campaignData.scheduledTime}
                      onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                      className="border-indigo-200 focus-visible:ring-indigo-400/50 bg-white/60"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Templates & Preview */}
        <div className="space-y-8">
          {/* Message Templates */}
          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-800 font-extrabold tracking-tight">
                <Sparkles className="h-5 w-5 text-pink-500" />
                Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {messageTemplates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="group w-full justify-start h-auto p-4 bg-white/50 hover:bg-gradient-to-r hover:from-indigo-500 hover:via-pink-500 hover:to-yellow-500 hover:text-white transition-all rounded-xl border-indigo-200/60"
                  onClick={() => useTemplate(template)}
                >
                  <div className="text-left">
                    <p className="font-semibold text-sm group-hover:text-white text-indigo-800 tracking-tight">
                      {template.name}
                    </p>
                    <p className="text-xs text-indigo-600/70 group-hover:text-white/80 truncate font-medium">
                      {template.subject}
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm shadow-lg ring-1 ring-white/50">
            <CardHeader>
              <CardTitle className="text-indigo-800 font-extrabold tracking-tight">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignData.subject && (
                <div>
                  <Label className="text-[11px] uppercase font-semibold tracking-wide text-indigo-600/70">Subject</Label>
                  <p className="mt-1 text-sm font-bold text-indigo-800">
                    {generatePersonalizedMessage(campaignData.subject, "John Doe")}
                  </p>
                </div>
              )}

              {campaignData.message && (
                <div>
                  <Label className="text-[11px] uppercase font-semibold tracking-wide text-indigo-600/70">Message</Label>
                  <div className="text-sm p-4 bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 rounded-xl border border-indigo-100/60 text-indigo-800 font-medium">
                    {generatePersonalizedMessage(campaignData.message, "John Doe")}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-indigo-600/70">
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
            disabled={!segment || !campaignData.name || !campaignData.subject || !campaignData.message || isCreating}
            className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-yellow-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-pink-500/30 border-0"
            size="lg"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
