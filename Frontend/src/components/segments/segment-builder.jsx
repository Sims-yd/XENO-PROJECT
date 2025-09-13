"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { RuleBuilder } from "./rule-builder"
import { AudiencePreview } from "./audience-preview"
import { NaturalLanguageInput } from "../ai/natural-language-input"
import { Target, Settings } from "lucide-react"

export function SegmentBuilder({ onSegmentSaved }) {
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
  const [rules, setRules] = useState([])
  const [audienceData, setAudienceData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock function to calculate audience based on rules
  const calculateAudience = async (rules) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock audience calculation based on rules
    const baseSize = 50000
    let mockSize = Math.floor(Math.random() * baseSize * 0.3) + 1000

    // Adjust size based on rule complexity
    if (rules.length > 2) mockSize = Math.floor(mockSize * 0.7)
    if (rules.some((r) => r.field === "totalSpend" && r.operator === ">" && Number.parseInt(r.value) > 10000)) {
      mockSize = Math.floor(mockSize * 0.4)
    }

    const mockData = {
      size: mockSize,
      demographics: {
        avgSpend: Math.floor(Math.random() * 15000) + 5000,
        totalSpend: mockSize * (Math.floor(Math.random() * 15000) + 5000),
        avgOrders: Math.floor(Math.random() * 8) + 2,
        totalOrders: mockSize * (Math.floor(Math.random() * 8) + 2),
        topCities: [
          { name: "Mumbai", count: Math.floor(mockSize * 0.25) },
          { name: "Delhi", count: Math.floor(mockSize * 0.2) },
          { name: "Bangalore", count: Math.floor(mockSize * 0.18) },
          { name: "Chennai", count: Math.floor(mockSize * 0.15) },
        ],
      },
      sampleCustomers: [
        {
          name: "Priya Sharma",
          email: "priya.s@email.com",
          totalSpend: 25000,
          orders: 12,
        },
        {
          name: "Rahul Gupta",
          email: "rahul.g@email.com",
          totalSpend: 18500,
          orders: 8,
        },
        {
          name: "Anita Patel",
          email: "anita.p@email.com",
          totalSpend: 32000,
          orders: 15,
        },
      ],
      insights: `This segment represents ${((mockSize / 50000) * 100).toFixed(1)}% of your customer base. These customers show high engagement with an average of ${Math.floor(Math.random() * 8) + 2} orders per customer. Consider targeting them with premium product recommendations or loyalty rewards.`,
    }

    setAudienceData(mockData)
  }

  const handlePreview = async (rules) => {
    if (rules.length === 0) return

    setAudienceData(null)
    await calculateAudience(rules)
  }

  const handleSaveSegment = async () => {
    if (!segmentName.trim() || !audienceData) return

    setIsLoading(true)

    // Simulate saving segment
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const segment = {
      id: Date.now(),
      name: segmentName,
      description: segmentDescription,
      rules: rules,
      audienceSize: audienceData.size,
      createdAt: new Date().toISOString(),
    }

    onSegmentSaved(segment)
    setIsLoading(false)
  }

  const handleAIRulesGenerated = (aiRules) => {
    setRules(aiRules)
    // Auto-preview when AI generates rules
    handlePreview(aiRules)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-in">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Target className="h-8 w-8 text-accent" />
          Segment Builder
        </h1>
        <p className="text-muted-foreground text-pretty">
          Create targeted customer segments using dynamic rules and AI-powered insights.
        </p>
      </div>

      <div className="animate-slide-in" style={{ animationDelay: "50ms" }}>
        <NaturalLanguageInput onRulesGenerated={handleAIRulesGenerated} />
      </div>

      {/* Segment Details */}
      <Card className="animate-slide-in" style={{ animationDelay: "100ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            Segment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="segment-name">Segment Name *</Label>
              <Input
                id="segment-name"
                placeholder="e.g., High Value Customers"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment-description">Description</Label>
              <Textarea
                id="segment-description"
                placeholder="Describe your target audience..."
                value={segmentDescription}
                onChange={(e) => setSegmentDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rule Builder */}
        <div className="animate-slide-in" style={{ animationDelay: "200ms" }}>
          <RuleBuilder rules={rules} onRulesChange={setRules} onPreview={handlePreview} />
        </div>

        {/* Audience Preview */}
        <div className="animate-slide-in" style={{ animationDelay: "300ms" }}>
          <AudiencePreview audienceData={audienceData} onSaveSegment={handleSaveSegment} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
