import { NotionEventsResponse } from '@/@types/globals';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_API_KEY });

export async function GET() {
  const databaseId = '7a9511415f9e4bc5859ef97fbef3f51b';

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  let result = (response.results as NotionEventsResponse).map((item) => ({
    name: item.properties.Name.title[0].plain_text,
    start: item.properties.Date.date.start,
    end: item.properties.Date.date.end,
    announcements: item.properties.Announcements.rich_text.map(
      (text) => text.text.link?.url,
    ),
  }));

  return Response.json(result);
}
