// generate token
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'


export const GET = async (req: NextRequest) => {
  try {
    const sessiontoken = req.cookies.get('next-auth.session-token')
    if (!sessiontoken) {
      console.log(sessiontoken)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    let decodedToken: any
    try {
      decodedToken = jwt.verify(sessiontoken, process.env.NEXTAUTH_SECRET as string)
    } catch (error) {
      console.error('JWT verification error:', error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log("decodedToken", decodedToken)
    
    return NextResponse.json({ message: 'Authorized' }, { status: 200 })    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}