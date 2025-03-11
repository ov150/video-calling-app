import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Video, Phone } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UserListProps {
  users: { username: string; socketId: string }[]
  onCallUser: (userId: string) => void
  incomingCall: any
  onAnswer: () => void
}

export default function UserList({ users, onCallUser, incomingCall, onAnswer }: UserListProps) {
  return (
    <div className="space-y-4">
      {incomingCall && (
        <Alert className="bg-blue-50 border-blue-200">
          <Phone className="h-4 w-4" />
          <AlertTitle>Incoming Call</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{incomingCall.callerName} is calling you</span>
            <Button onClick={onAnswer} className="bg-green-500 hover:bg-green-600">
              Answer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Available Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users available</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.socketId} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>{user.username}</span>
                  </div>
                  <Button onClick={() => onCallUser(user.socketId)} className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    <span>Call</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}