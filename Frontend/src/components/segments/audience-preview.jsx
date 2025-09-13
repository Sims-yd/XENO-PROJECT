"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Users, TrendingUp, MapPin, ShoppingBag } from "lucide-react"

export function AudiencePreview({ audienceData, onSaveSegment, isLoading }) {
  if (!audienceData) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Audience Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Define rules to preview your audience</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { size, demographics, sampleCustomers, insights } = audienceData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Audience Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audience Size */}
        <div className="text-center p-6 bg-accent/5 rounded-lg border border-accent/20">
          <div className="text-3xl font-bold text-accent mb-2">{size.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">customers match your criteria</p>
          <Badge variant="secondary" className="mt-2">
            {((size / 50000) * 100).toFixed(1)}% of total customers
          </Badge>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Spending
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average:</span>
                <span className="font-medium">₹{demographics.avgSpend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">₹{demographics.totalSpend.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-accent" />
              Orders
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average:</span>
                <span className="font-medium">{demographics.avgOrders}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">{demographics.totalOrders.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Cities */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Top Cities
          </h4>
          <div className="flex flex-wrap gap-2">
            {demographics.topCities.map((city, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {city.name} ({city.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Sample Customers */}
        <div className="space-y-3">
          <h4 className="font-medium">Sample Customers</h4>
          <div className="space-y-2">
            {sampleCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg text-sm">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-muted-foreground">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{customer.totalSpend.toLocaleString()}</p>
                  <p className="text-muted-foreground">{customer.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        {insights && (
          <div className="space-y-3">
            <h4 className="font-medium">AI Insights</h4>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-sm text-muted-foreground">{insights}</p>
            </div>
          </div>
        )}

        {/* Save Segment Button */}
        <Button
          onClick={onSaveSegment}
          disabled={isLoading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              Saving segment...
            </div>
          ) : (
            "Save Segment & Create Campaign"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
