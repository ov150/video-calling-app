import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface JoinScreenProps {
  onJoin: (username: string) => void
}

export default function JoinScreen({ onJoin }: JoinScreenProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onJoin(name.trim())
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Join Video Call</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Join</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}