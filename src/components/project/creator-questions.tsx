'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, MessageSquare } from 'lucide-react'

interface CreatorQuestionsProps {
  questions: string[]
  creatorName: string
}

export default function CreatorQuestions({ questions, creatorName }: CreatorQuestionsProps) {
  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <HelpCircle className="w-5 h-5" />
          {creatorName} is looking for feedback
        </CardTitle>
        <p className="text-sm text-blue-700">
          The creator would love your thoughts on these specific aspects:
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{question}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Share your thoughts in the comments below
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> When commenting, mention which question you&apos;re answering (e.g., &quot;Regarding #1...&quot;)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}