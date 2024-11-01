"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gift, Calendar, ArrowRight, Coins } from "lucide-react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { handleCreditUpdate, handleVerifyRegistration } from "@/actions/creditsAction"
import { useUserStore } from "@/utils/userStore"

export default function Component() {
  const { data: session } = useSession();
  const { userData } = useUserStore();

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const countdownRef = useRef<HTMLParagraphElement>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = useCallback(async () => {
    try {
      if (session) {
        console.log("first")
        const email = session.user.email
        if (!email) {
          toast.error("Failed to Register")
          return;
        }
        const res = await handleCreditUpdate({ email })

        if (res === "success") {
          setIsRegistered((prev) => !prev)
          toast.success("Registered Successfully")
        } else {
          toast.error("Failed to Register")
        }
      } else {
        if (!userData?.email) {
          toast.error("Failed to Register")
          return
        }
        const email = userData.email;

        const res = await handleCreditUpdate({ email });

        if (res === "success") {
          setIsRegistered((prev) => !prev)
          toast.success("Registerd Successfully")
        } else {
          toast.error("Failed to Register")
        }
      }
    } catch (error) {
      toast.error("Failed to Register")
    }
  }, [session, userData?.email])


  useEffect(() => {
    const verifyRegistration = async () => {
      try {
        if (session) {
          const email = session.user.email
          if (!email) {
            toast.error("Failed to Register")
            return;
          }

          const res = await handleVerifyRegistration({ email })

          if (res === true) {
            setIsRegistered(true)
          } else {
            setIsRegistered(false)
          }
        } else if (userData?.email) {
          if (!userData?.email) {
            toast.error("Failed to Register")
            return
          }
          const email = userData.email;

          const res = await handleVerifyRegistration({ email });

          if (res === true) {
            setIsRegistered(true)
          } else {
            setIsRegistered(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    verifyRegistration();
  }, [session, userData?.email])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const releaseDate = new Date("2024-11-03T19:00:00"); // November 3, 2024, at 7 PM
      const difference = releaseDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        if (countdownRef.current) {
          countdownRef.current.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      } else {
        if (countdownRef.current) {
          countdownRef.current.innerHTML = "Registration Closed";
        }
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);


  return (
    <div className="h-custom w-full grid place-items-center relative">
      <div className={`w-full max-w-4xl mx-auto mb-6 p-4 border-l-4 border-primary text-primary duration-1000 ease-in-out rounded absolute top-10 ${showAnnouncement ? "opacity-100" : "opacity-0"}`}>
        <p className="font-semibold text-center">
          Considering that in some regions of India people are celebrating Diwali today, we&apos;ll be launching <span className="font-bold">AI Mock Interviewer</span> on <span className="font-bold">3rd November 2024, at the same time. See you then</span>!
        </p>
      </div>
      {
        !isRegistered ? (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">AI Mock Interviewer Early Access!</CardTitle>
              <CardDescription>Be among the first to experience our game-changing update</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">Earn 250 wiZcoins </span>
              </div>
              <Progress value={80} className="w-full h-2" aria-label="80% of early registration slots filled" />
              <p className="text-sm text-muted-foreground">
                Register now and receive 250 credits when the feature launches. Early bird slots are filling up fast!
              </p>
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Releasing on:</span>
                </div>
                <Badge variant="secondary" className="text-sm font-bold">
                  3rd Nov 2024, &nbsp; 7:00 PM
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time until release:</p>
                <p className="text-lg font-bold" aria-live="polite" ref={countdownRef}></p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:text-primary hover:shadow-md" size="lg" onClick={handleRegister}  >
                Register Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-4xl space-y-4 mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Congratulations! You&apos;ve joined the Early Access!</CardTitle>
              <CardDescription>You&apos;ve registered for our upcoming feature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold">250 wiZcoins Received</span>
              </div>
              <Progress value={100} className="w-full h-2" aria-label="250 credits received" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Hello <span className="font-bold">{userData?.name?.split(" ")[0]}</span>,
                </p>
                <p>
                  Thank you for joining the early access of our &apos;<span className="font-semibold text-slate-900">AI Mock Interviewer</span>&apos;! 250 wiZcoins have been credited to your account, which you can use for &apos;<span className="font-semibold text-slate-900">AI Mock Interview</span>&apos;, &apos;<span className="font-semibold text-slate-900">AI CV Review</span>&apos;, and other exciting features.
                </p>
                <p>
                  Join us again on November 3rd, from 7 PM onwards to start using and experiencing the &apos;<span className="font-semibold text-slate-900">AI Mock Interviewer</span>&apos;. Until then, enjoy the festive season with your family and loved ones.
                </p>
                <p className="font-bold">
                  Happy Diwali!
                </p>
              </div>
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium">Release Date:</span>
                </div>
                <Badge variant="secondary" className="text-sm font-bold">
                  3rd Nov 2024, &nbsp; 7:00 PM
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Time until release:</p>
                <p className="text-lg font-bold" aria-live="polite" ref={countdownRef}></p>
              </div>
            </CardContent>
          </Card>
        )
      }
    </div>
  );
}