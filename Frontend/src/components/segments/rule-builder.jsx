"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Plus, Trash2, Users, Filter } from "lucide-react"

export function RuleBuilder({ rules, onRulesChange, onPreview }) {
  const [previewLoading, setPreviewLoading] = useState(false)

  const fieldOptions = [
    { value: "totalSpend", label: "Total Spend", type: "number" },
    { value: "visits", label: "Total Visits", type: "number" },
    { value: "lastOrderDate", label: "Last Order Date", type: "date" },
    { value: "registrationDate", label: "Registration Date", type: "date" },
    { value: "orderCount", label: "Order Count", type: "number" },
    { value: "avgOrderValue", label: "Average Order Value", type: "number" },
    { value: "city", label: "City", type: "text" },
    { value: "age", label: "Age", type: "number" },
  ]

  const operatorOptions = {
    number: [
      { value: ">", label: "Greater than" },
      { value: "<", label: "Less than" },
      { value: "=", label: "Equal to" },
      { value: ">=", label: "Greater than or equal" },
      { value: "<=", label: "Less than or equal" },
      { value: "between", label: "Between" },
    ],
    text: [
      { value: "=", label: "Equal to" },
      { value: "!=", label: "Not equal to" },
      { value: "contains", label: "Contains" },
      { value: "startsWith", label: "Starts with" },
    ],
    date: [
      { value: ">", label: "After" },
      { value: "<", label: "Before" },
      { value: "=", label: "On" },
      { value: "lastNDays", label: "In last N days" },
    ],
  }

  const addRule = () => {
    const newRule = {
      id: Date.now(),
      field: "",
      operator: "",
      value: "",
      value2: "", // For between operator
      logic: rules.length > 0 ? "AND" : null,
    }
    onRulesChange([...rules, newRule])
  }

  const updateRule = (ruleId, updates) => {
    const updatedRules = rules.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule))
    onRulesChange(updatedRules)
  }

  const removeRule = (ruleId) => {
    const updatedRules = rules.filter((rule) => rule.id !== ruleId)
    // Update logic for the first rule if needed
    if (updatedRules.length > 0 && updatedRules[0].logic) {
      updatedRules[0] = { ...updatedRules[0], logic: null }
    }
    onRulesChange(updatedRules)
  }

  const getFieldType = (fieldValue) => {
    const field = fieldOptions.find((f) => f.value === fieldValue)
    return field?.type || "text"
  }

  const handlePreview = async () => {
    setPreviewLoading(true)
    try {
      await onPreview(rules)
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-accent" />
          Audience Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
            <p className="text-base sm:text-lg font-medium mb-2">No rules defined</p>
            <p className="text-sm">Add your first rule to start building your audience segment</p>
          </div>
        )}

        {rules.map((rule, index) => (
          <div key={rule.id} className="space-y-3">
            {/* Logic Operator (AND/OR) */}
            {rule.logic && (
              <div className="flex justify-center">
                <Select value={rule.logic} onValueChange={(value) => updateRule(rule.id, { logic: value })}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Rule Definition */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 p-3 sm:p-4 border border-border rounded-lg bg-muted/20">
              <Badge variant="outline" className="text-xs w-fit">
                Rule {index + 1}
              </Badge>

              {/* Field Selection */}
              <Select
                value={rule.field}
                onValueChange={(value) =>
                  updateRule(rule.id, {
                    field: value,
                    operator: "",
                    value: "",
                    value2: "",
                  })
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Operator Selection */}
              {rule.field && (
                <Select
                  value={rule.operator}
                  onValueChange={(value) =>
                    updateRule(rule.id, {
                      operator: value,
                      value: "",
                      value2: "",
                    })
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatorOptions[getFieldType(rule.field)]?.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Value Input */}
              {rule.operator && (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <Input
                    type={
                      getFieldType(rule.field) === "number"
                        ? "number"
                        : getFieldType(rule.field) === "date"
                          ? "date"
                          : "text"
                    }
                    placeholder="Value"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    className="w-full sm:w-32"
                  />

                  {/* Second value for "between" operator */}
                  {rule.operator === "between" && (
                    <>
                      <span className="text-sm text-muted-foreground hidden sm:inline">and</span>
                      <Input
                        type={
                          getFieldType(rule.field) === "number"
                            ? "number"
                            : getFieldType(rule.field) === "date"
                              ? "date"
                              : "text"
                        }
                        placeholder="Value"
                        value={rule.value2}
                        onChange={(e) => updateRule(rule.id, { value2: e.target.value })}
                        className="w-full sm:w-32"
                      />
                    </>
                  )}
                </div>
              )}

              {/* Remove Rule Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(rule.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 sm:mr-2" />
                <span className="sm:hidden">Remove Rule</span>
              </Button>
            </div>
          </div>
        ))}

        {/* Add Rule Button */}
        <Button variant="outline" onClick={addRule} className="w-full border-dashed bg-transparent">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>

        {/* Preview Button */}
        {rules.length > 0 && (
          <Button
            onClick={handlePreview}
            disabled={previewLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {previewLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Calculating audience...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Preview Audience
              </div>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
