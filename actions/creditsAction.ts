"use server"
import prisma from "@/lib"

type SessionData = {
  email: string
}

type UserData = {
  email: string,
  password: string
}


export const handleCreditUpdate = async (data: SessionData | UserData) => {
  try {

    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    console.log("user ", user)

    if (!user) {
      return "failed"
    }

    await prisma.user.update({
      where: {
        email: data.email
      },
      data: {
        credits: 250,
        isRegistered: true
      }
    })

    return "success"
  } catch (error) {
    console.log("error ", error)

  }
  return "failed"
}

export const handleVerifyRegistration = async ({ email }: { email: string }) => {
  try {

    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    console.log("user ", user)

    if (!user) {
      return false
    }

    if (user.isRegistered)
      return true

    return false

  } catch (error) {
    console.log("error ", error)
  }
  return false
}