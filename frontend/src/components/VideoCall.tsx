import { useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PhoneOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface VideoCallProps {
  stream: MediaStream
  callAccepted: boolean
  callData: any
  caller?: string
  onAnswer: () => void
  onEnd: () => void
}

export default function VideoCall({ 
  stream, 
  callAccepted,
  callData,
  caller,
  onAnswer,
  onEnd
}: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  console.log(callData)
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Camera</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="rounded-lg border border-gray-200 w-full max-w-md aspect-video object-cover"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Remote Camera</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {callAccepted ? (
            <video
              id="remote-video"
              autoPlay
              className="rounded-lg border border-gray-200 w-full max-w-md aspect-video object-cover"
            />
          ) : caller ? (
            <div className="flex items-center justify-center w-full max-w-md aspect-video bg-gray-100 rounded-lg">
              <Alert className="bg-blue-50 border-blue-200 w-full">
                <AlertTitle>Incoming Call</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                  <span>{caller} is calling you</span>
                  <Button onClick={onAnswer} className="bg-green-500 hover:bg-green-600">
                    Answer Call
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full max-w-md aspect-video bg-gray-100 rounded-lg">
              <p className="text-gray-500">Waiting for connection...</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={onEnd} 
            variant="destructive" 
            className="flex items-center gap-1"
          >
            <PhoneOff className="h-4 w-4" />
            <span>End Call</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}