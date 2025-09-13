"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react"

export function MessageSuggestions({ onMessageSelected, segmentInfo }) {
  const [objective, setObjective] = useState("")
  const [tone, setTone] = useState("friendly")
  const [suggestions, setSuggestions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const objectives = [
    { value: "winback", label: "Win back inactive customers" },
    { value: "upsell", label: "Upsell to existing customers" },
    { value: "welcome", label: "Welcome new customers" },
    { value: "promotion", label: "Promote special offers" },
    { value: "loyalty", label: "Reward loyal customers" },
    { value: "feedback", label: "Request customer feedback" },
  ]

  const tones = [
    { value: "friendly", label: "Friendly & Casual" },
    { value: "professional", label: "Professional" },
    { value: "urgent", label: "Urgent & Direct" },
    { value: "exclusive", label: "Exclusive & Premium" },
    { value: "playful", label: "Playful & Fun" },
  ]

  const messageTemplates = {
    winback: {
      friendly: [
        {
          subject: "We miss you, {name}! 💙",
          message:
            "Hi {name}, we noticed you haven't visited us in a while. We'd love to have you back! Here's a special 20% discount just for you. Use code COMEBACK20 and rediscover what you've been missing.",
        },
        {
          subject: "Your favorite store misses you!",
          message:
            "Hello {name}, it's been too long! We've added some amazing new products that we think you'll love. Come back and get 15% off your next purchase with code WELCOME15.",
        },
        {
          subject: "Special offer just for you, {name}",
          message:
            "Hi {name}, we value your past business and want to welcome you back with open arms. Enjoy 25% off your next order plus free shipping. Code: RETURN25",
        },
      ],
      professional: [
        {
          subject: "Exclusive return offer for valued customers",
          message:
            "Dear {name}, we appreciate your previous business and would like to invite you back with an exclusive 20% discount on your next purchase. This offer is valid for the next 7 days.",
        },
        {
          subject: "We'd like to welcome you back",
          message:
            "Dear {name}, as a valued former customer, we're extending a special invitation to return with a 15% discount on our latest collection. Use code RETURN15 at checkout.",
        },
      ],
    },
    upsell: {
      friendly: [
        {
          subject: "Perfect additions to your recent purchase!",
          message:
            "Hi {name}, loved your recent order? We've handpicked some items that go perfectly with your purchase. Get 10% off when you add any of these to your collection!",
        },
        {
          subject: "Complete your collection, {name}!",
          message:
            "Hey {name}, based on your awesome taste, we think you'll love these complementary items. Bundle them with your recent purchase and save 15%!",
        },
      ],
      exclusive: [
        {
          subject: "Exclusive premium collection for VIP customers",
          message:
            "Dear {name}, as one of our premium customers, you get first access to our luxury collection. Enjoy complimentary shipping and exclusive member pricing.",
        },
      ],
    },
    welcome: {
      friendly: [
        {
          subject: "Welcome to the family, {name}! 🎉",
          message:
            "Hi {name}, welcome aboard! We're thrilled to have you join our community. Here's a 15% welcome discount to get you started. Use code WELCOME15 on your first order!",
        },
        {
          subject: "Your journey starts here, {name}!",
          message:
            "Hello {name}, welcome to our store! We can't wait for you to explore our collection. Start with 20% off your first purchase using code NEWBIE20.",
        },
      ],
    },
    promotion: {
      urgent: [
        {
          subject: "⏰ 24 hours left: 50% OFF everything!",
          message:
            "Hi {name}, this is it! Our biggest sale of the year ends in 24 hours. Don't miss out on 50% off everything. Shop now before it's too late!",
        },
        {
          subject: "Last chance: Flash sale ends tonight!",
          message:
            "Hey {name}, our flash sale ends at midnight! Grab your favorites at 40% off. This deal won't come again soon. Shop now!",
        },
      ],
      exclusive: [
        {
          subject: "VIP Early Access: New Collection Launch",
          message:
            "Dear {name}, as a VIP member, you get 48-hour early access to our new collection before anyone else. Plus, enjoy 20% off as our exclusive launch offer.",
        },
      ],
    },
  }

  const generateMessages = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const objectiveMessages = messageTemplates[objective] || messageTemplates.promotion
    const toneMessages = objectiveMessages[tone] || objectiveMessages[Object.keys(objectiveMessages)[0]]

    setSuggestions(toneMessages || [])
    setIsGenerating(false)
  }

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const useMessage = (suggestion) => {
    onMessageSelected(suggestion.subject, suggestion.message)
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Message Suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get AI-generated message suggestions based on your campaign objective
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaign Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Campaign Objective</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                {objectives.map((obj) => (
                  <SelectItem key={obj.value} value={obj.value}>
                    {obj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Message Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segment Context */}
        {segmentInfo && (
          <div className="p-3 bg-background/50 rounded-lg border border-accent/20">
            <p className="text-xs text-muted-foreground mb-1">Target Audience:</p>
            <p className="text-sm font-medium">{segmentInfo.name}</p>
            <p className="text-xs text-muted-foreground">{segmentInfo.audienceSize?.toLocaleString()} customers</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateMessages}
          disabled={!objective || isGenerating}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              AI is crafting messages...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Message Suggestions
            </div>
          )}
        </Button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">AI Suggestions:</h4>
              <Button variant="outline" size="sm" onClick={generateMessages} className="text-xs bg-transparent">
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-background/50 rounded-lg border border-accent/20 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      Option {index + 1}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${suggestion.subject}\n\n${suggestion.message}`, index)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Subject:</Label>
                      <p className="text-sm font-medium">{suggestion.subject}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Message:</Label>
                      <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => useMessage(suggestion)} className="w-full">
                    Use This Message
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
