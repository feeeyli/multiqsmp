import { EventType } from '@/@types/data';

function FroggTV() {
  return {
    picture:
      'https://pbs.twimg.com/profile_images/1723900518399963136/P21V1gu6_400x400.jpg',
    name: 'FROGG',
    username: 'FroggersTV',
  };
}

export const FROGG_EVENTS: EventType[] = [
  {
    name: 'Julgamento',
    time: new Date('2024-01-25T20:00:00-03:00'),
    announcements: [
      {
        publisher: FroggTV(),
        text: 'Esvaziem suas agendas, teremos compromisso.\n\nAqueles que vão contra as vontades da lei devem arcar com as punições perante a seus atos\n\nDia **25** de Janeiro, **20:00 BRT**\n*#FMSP* *#FROGG*',
        link: 'https://twitter.com/FroggersTV/status/1748420063672127581',
        pictures: [
          'https://pbs.twimg.com/media/GEOQe0HXwAESNDo?format=jpg&name=large',
        ],
      },
      {
        publisher: FroggTV(),
        text: 'SERIA DREAS O CULPADO POR TODOS OS CRIMES EM QUE FOI ACUSADO PERANTE O TRIBUNAL?\n\nfaltam 4 dias\nDia **25** de Janeiro, **20:00 BRT** *#FSMP* *#FROGG*',
        link: 'https://twitter.com/FroggersTV/status/1749084435176174058',
        pictures: [
          'https://pbs.twimg.com/media/GEVjSbBW4AAw1fW?format=jpg&name=large',
        ],
      },
      {
        publisher: FroggTV(),
        text: 'OU SERIA TIBA O CULPADO POR TODOS OS CRIMES EM QUE FOI ACUSADO PERANTE O TRIBUNAL? \n\nfaltam 3 dias\nDia **25** de Janeiro, **20:00 BRT** *#FSMP* *#FROGG*',
        link: 'https://twitter.com/FroggersTV/status/1749459813484904842',
        pictures: [
          'https://pbs.twimg.com/media/GEdUYzEWEAAK4Yy?format=jpg&name=large',
        ],
      },
    ],
  },
];
