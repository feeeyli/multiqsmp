type Messages = typeof import('../messages/pt.json');
declare interface IntlMessages extends Messages {}

export type NotionEventsResponse = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: string;
    id: string;
  };
  last_edited_by: {
    object: string;
    id: string;
  };
  cover: null;
  icon: null;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: {
    Date: {
      id: string;
      type: string;
      date: {
        start: string;
        end: string;
        time_zone: null;
      };
    };
    Announcements: {
      id: string;
      type: string;
      rich_text: (
        | {
            type: string;
            text: {
              content: string;
              link: {
                url: string;
              };
            };
            annotations: {
              bold: boolean;
              italic: boolean;
              strikethrough: boolean;
              underline: boolean;
              code: boolean;
              color: string;
            };
            plain_text: string;
            href: string;
          }
        | {
            type: string;
            text: {
              content: string;
              link: null;
            };
            annotations: {
              bold: boolean;
              italic: boolean;
              strikethrough: boolean;
              underline: boolean;
              code: boolean;
              color: string;
            };
            plain_text: string;
            href: null;
          }
      )[];
    };
    Name: {
      id: string;
      type: string;
      title: {
        type: string;
        text: {
          content: string;
          link: null;
        };
        annotations: {
          bold: boolean;
          italic: boolean;
          strikethrough: boolean;
          underline: boolean;
          code: boolean;
          color: string;
        };
        plain_text: string;
        href: null;
      }[];
    };
  };
  url: string;
  public_url: null;
}[];

export type EventResponse = {
  name: string;
  start: string;
  end: string;
  announcements: (string | undefined)[];
};
