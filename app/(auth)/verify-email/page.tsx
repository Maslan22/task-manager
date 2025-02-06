"use client";

import { useEffect, useState } from "react";
import {  useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Verification failed");
        }

        setStatus("success");
      } catch (error) {
        setStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Verification failed"
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="lg:p-8">
        <Card className="mx-auto max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center">
              {status === "verifying" && "Verifying your email..."}
              {status === "success" && "Your email has been verified!"}
              {status === "error" && "Verification failed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "verifying" && (
              <div className="text-center">
                <p>Please wait while we verify your email address...</p>
              </div>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <p className="text-center text-green-600">
                  Your email has been successfully verified. You can now log in
                  to your account.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <p className="text-center text-red-500">{error}</p>
                <p className="text-center">
                  If you're having trouble, you can request a new verification
                  email on the login page.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
