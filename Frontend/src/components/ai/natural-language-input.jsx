"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { Sparkles, Wand2, ArrowRight } from "lucide-react"

export function NaturalLanguageInput({ onRulesGenerated }) {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedRules, setGeneratedRules] = useState(null)

  const examplePrompts = [
    "Customers who spent more than ₹10,000 and haven't ordered in 90 days",
    "Users from Mumbai or Delhi with more than 5 orders",
    "High-value customers who registered in the last 6 months",
    "Inactive users who spent between ₹5,000 and ₹15,000",
  ]

  const useExample = (example) => {
    setInput(example)
  }

  // Mock AI processing function
  const processNaturalLanguage = async (text) => {
    setIsProcessing(true)

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock rule generation based on common patterns
    const rules = []

    // Parse spending patterns
    const spendMatch = text.match(/spent?\s+(?:more than|>\s*|above)\s*₹?(\d+(?:,\d+)*)/i)
    if (spendMatch) {
      const amount = Number.parseInt(spendMatch[1].replace(/,/g, ""))
      rules.push({
        id: Date.now() + Math.random(),
        field: "totalSpend",
        operator: ">",
        value: amount.toString(),
        logic: rules.length > 0 ? "AND" : null,
      })
    }

    const spendBetweenMatch = text.match(/spent?\s+between\s*₹?(\d+(?:,\d+)*)\s*and\s*₹?(\d+(?:,\d+)*)/i)
    if (spendBetweenMatch) {
      const min = Number.parseInt(spendBetweenMatch[1].replace(/,/g, ""))
      const max = Number.parseInt(spendBetweenMatch[2].replace(/,/g, ""))
      rules.push({
        id: Date.now() + Math.random(),
        field: "totalSpend",
        operator: "between",
        value: min.toString(),
        value2: max.toString(),
        logic: rules.length > 0 ? "AND" : null,
      })
    }

    // Parse order patterns
    const orderMatch = text.match(/(?:more than|>\s*|above)\s*(\d+)\s*orders?/i)
    if (orderMatch) {
      rules.push({
        id: Date.now() + Math.random(),
        field: "orderCount",
        operator: ">",
        value: orderMatch[1],
        logic: rules.length > 0 ? "AND" : null,
      })
    }

    // Parse time-based patterns
    const daysMatch = text.match(/(?:haven't|not)\s+(?:ordered|visited|shopped).*?(\d+)\s*days?/i)
    if (daysMatch) {
      rules.push({
        id: Date.now() + Math.random(),
        field: "lastOrderDate",
        operator: "lastNDays",
        value: daysMatch[1],
        logic: rules.length > 0 ? "AND" : null,
      })
    }

    const monthsMatch = text.match(/(?:registered|joined).*?(?:last|past)\s*(\d+)\s*months?/i)
    if (monthsMatch) {
      const days = Number.parseInt(monthsMatch[1]) * 30
      rules.push({
        id: Date.now() + Math.random(),
        field: "registrationDate",
        operator: "lastNDays",
        value: days.toString(),
        logic: rules.length > 0 ? "AND" : null,
      })
    }

    // Parse location patterns
    const cityMatch = text.match(/from\s+(Mumbai|Delhi|Bangalore|Chennai|Kolkata|Hyderabad|Pune)/i)
    if (cityMatch) {
      rules.push({
        id: Date.now() + Math.random(),
        field: "city",
        operator: "=",
        value: cityMatch[1],
        logic: rules.length > 0 ? "OR" : null,
      })
    }

    // Parse multiple cities
    const multipleCitiesMatch = text.match(/(Mumbai|Delhi|Bangalore|Chennai)\s+or\s+(Mumbai|Delhi|Bangalore|Chennai)/i)
    if (multipleCitiesMatch) {
      rules.push({
        id: Date.now() + Math.random(),
        field: "city",
        operator: "=",
        value: multipleCitiesMatch[1],
        logic: rules.length > 0 ? "AND" : null,
      })
      rules.push({
        id: Date.now() + Math.random(),
        field: "city",
        operator: "=",
        value: multipleCitiesMatch[2],
        logic: "OR",
      })
    }

    // If no specific patterns found, create a default rule
    if (rules.length === 0) {
      rules.push({
        id: Date.now(),
        field: "totalSpend",
        operator: ">",
        value: "5000",
        logic: null,
      })
    }

    setGeneratedRules(rules)
    setIsProcessing(false)

    return rules
  }

  const handleGenerate = async () => {
    if (!input.trim()) return

    const rules = await processNaturalLanguage(input)
    setGeneratedRules(rules)
  }

  const handleApplyRules = () => {
    if (generatedRules) {
      onRulesGenerated(generatedRules)
      setInput("")
      setGeneratedRules(null)
    }
  }

  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI-Powered Segment Builder
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe your target audience in plain English, and AI will create the rules for you
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Natural Language Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="e.g., 'Customers who spent more than ₹10,000 and haven't ordered in 90 days'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[80px] bg-background/50"
          />
        </div>

        {/* Example Prompts */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 px-3 bg-background/50 hover:bg-accent/20"
                onClick={() => useExample(example)}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!input.trim() || isProcessing}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              AI is analyzing your request...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate Rules with AI
            </div>
          )}
        </Button>

        {/* Generated Rules Preview */}
        {generatedRules && (
          <div className="space-y-3 p-4 bg-background/50 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Generated Rules:</h4>
              <Badge variant="secondary" className="text-xs">
                {generatedRules.length} rule{generatedRules.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="space-y-2">
              {generatedRules.map((rule, index) => (
                <div key={rule.id} className="text-sm">
                  {rule.logic && <span className="text-accent font-medium">{rule.logic} </span>}
                  <span className="font-medium">{rule.field}</span>
                  <span className="text-muted-foreground"> {rule.operator} </span>
                  <span className="font-medium">{rule.value}</span>
                  {rule.value2 && (
                    <>
                      <span className="text-muted-foreground"> and </span>
                      <span className="font-medium">{rule.value2}</span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleApplyRules}
              size="sm"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Apply These Rules
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
