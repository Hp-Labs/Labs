import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const res = await fetch('https://feeds.feedburner.com/TheHackersNews');
    if (!res.ok) throw new Error("Failed to fetch cybersecurity news");
    
    const xml = await res.text();
    const items = [];
    
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let id = 1;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      const title = titleMatch?.[1]?.replace("<![CDATA[", "").replace("]]>", "").trim();
      const link = linkMatch?.[1]?.trim();
      const pubDate = pubDateMatch?.[1]?.trim();
      
      if (title && link) {
        items.push({
          id: id++,
          title,
          date: pubDate ? new Date(pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          source: 'The Hacker News',
          url: link
        });
      }
    }
    
    if (items.length === 0) {
      return NextResponse.json({ success: false, error: "No news found from upstream feed." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
