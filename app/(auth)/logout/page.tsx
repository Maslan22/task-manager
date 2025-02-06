import { SubmitButton } from "@/app/components/SubmitButtons"
import { auth, signOut } from "@/app/utils/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function LogoutPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="lg:p-8">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle>Sign Out</CardTitle>
            <CardDescription>
              Are you sure you want to sign out?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <SubmitButton text="Sign Out" variant={"destructive"}/>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}