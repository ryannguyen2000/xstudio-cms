import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    const response = await fetch('[invalid url, do not cite]', {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      return NextResponse.json({ error: 'Upload failed' }, { status: response.status })
    }
    const data = await response.json()
    return NextResponse.json({ url: data.mediaUrl })
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
