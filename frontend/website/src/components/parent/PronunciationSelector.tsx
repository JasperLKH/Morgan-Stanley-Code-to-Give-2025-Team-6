import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Palette, BarChart3, Calendar, Sparkles } from 'lucide-react';
import { PronunciationPortalV1 } from './PronunciationPortalV1';
import { PronunciationPortalV2 } from './PronunciationPortalV2';
import { PronunciationPortalV3 } from './PronunciationPortalV3';
import { PronunciationPortalV4 } from './PronunciationPortalV4';

type PortalVariation = 'selector' | 'v1' | 'v2' | 'v3' | 'v4';

export function PronunciationSelector() {
  const [selectedPortal, setSelectedPortal] = useState<PortalVariation>('selector');

  const variations = [
    {
      id: 'v1' as PortalVariation,
      title: 'Card-Grid Layout',
      description: 'Clean card-based design with horizontal progress overview',
      features: ['2x2 Progress Cards', 'Activity Timeline', 'Dashed CTA Section'],
      colors: 'Blue/Green + Orange/Yellow',
      bestFor: 'Parents who like organized, structured information',
      icon: <Palette className="w-6 h-6" />,
      preview: 'Modern card layout with colorful progress metrics'
    },
    {
      id: 'v2' as PortalVariation,
      title: 'Timeline Activity Feed',
      description: 'Vertical timeline with integrated activity stream',
      features: ['Progress Bars', 'Weekly Goals', 'Activity History'],
      colors: 'Slate/Blue + Teal accents',
      bestFor: 'Parents who want detailed progress tracking',
      icon: <Calendar className="w-6 h-6" />,
      preview: 'Timeline-focused with comprehensive activity feed'
    },
    {
      id: 'v3' as PortalVariation,
      title: 'Dashboard Analytics',
      description: 'Chart-focused with comprehensive progress metrics',
      features: ['Line Charts', 'Category Analysis', 'Data Visualization'],
      colors: 'Indigo/Cyan + Analytics styling',
      bestFor: 'Data-driven parents who want detailed insights',
      icon: <BarChart3 className="w-6 h-6" />,
      preview: 'Professional dashboard with charts and analytics'
    },
    {
      id: 'v4' as PortalVariation,
      title: 'Minimalist Focus',
      description: 'Clean, simple design emphasizing ease of use',
      features: ['Large Practice Button', 'Emoji Integration', 'Simple Metrics'],
      colors: 'Sky Blue to Emerald gradient',
      bestFor: 'Parents preferring simplicity and child-friendly design',
      icon: <Sparkles className="w-6 h-6" />,
      preview: 'Friendly, minimal design with focus on practice'
    }
  ];

  if (selectedPortal !== 'selector') {
    return (
      <div className="relative">
        {/* Back button overlay */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setSelectedPortal('selector')}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-gray-300 shadow-lg hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selector
          </Button>
        </div>

        {/* Selected Portal */}
        {selectedPortal === 'v1' && <PronunciationPortalV1 />}
        {selectedPortal === 'v2' && <PronunciationPortalV2 />}
        {selectedPortal === 'v3' && <PronunciationPortalV3 />}
        {selectedPortal === 'v4' && <PronunciationPortalV4 />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Pronunciation Portal Variations
          </h1>
          <p className="text-gray-600">
            Choose a design variation to test and compare different approaches
          </p>
        </div>

        {/* Variations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {variations.map((variation) => (
            <Card 
              key={variation.id} 
              className="border-2 hover:border-blue-300 transition-all duration-200 hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedPortal(variation.id)}
            >
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {variation.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{variation.title}</CardTitle>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {variation.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 italic">
                    "{variation.preview}"
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {variation.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Color Palette:</h4>
                  <p className="text-sm text-gray-600">{variation.colors}</p>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Best For:</h4>
                  <p className="text-sm text-gray-600">{variation.bestFor}</p>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setSelectedPortal(variation.id)}
                >
                  View {variation.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Design Notes */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-amber-900 mb-3">
              🎨 Design Testing Notes
            </h3>
            <div className="text-sm text-amber-800 space-y-2">
              <p>
                <strong>Mobile-First:</strong> All variations are optimized for mobile screens (390×844px)
              </p>
              <p>
                <strong>Color Psychology:</strong> Each uses trust-building blues/greens with growth-oriented orange/yellow accents
              </p>
              <p>
                <strong>Functionality:</strong> All include pronunciation practice modals with microphone recording and scoring
              </p>
              <p>
                <strong>Parent-Friendly:</strong> Large tap targets, readable fonts, and intuitive navigation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}