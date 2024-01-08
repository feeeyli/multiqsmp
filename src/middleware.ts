import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(
    new URL(
      request.nextUrl.pathname.slice(0, 3) +
        '?streamers=qsmp/BadBoyHalo/fitmc/Foolish/ironmouse/jaidenanimations/lenay/nihachu/philza/quackity/slimecicle/tinakitten/tubbo/TubboLIVE/wilbursoot/carreraaa/elmariana/quackitytoo/germangarmendia/luzu/agentemaxo/missasinfonia/polispol1/rivers_gg/roier/rubius/vegetta777/willyrex/bagi/cellbit/felps/linkthemike/peqitw/antoinedaniel/aypierre/bagherajones/etoiles/kamet0&chats=qsmp/BadBoyHalo/fitmc/Foolish/ironmouse/jaidenanimations/lenay/nihachu/philza/quackity/slimecicle/tinakitten/tubbo/TubboLIVE/wilbursoot/carreraaa/elmariana/quackitytoo/germangarmendia/luzu/agentemaxo/missasinfonia/polispol1/rivers_gg/roier/rubius/vegetta777/willyrex/bagi/cellbit/felps/linkthemike/peqitw/antoinedaniel/aypierre/bagherajones/etoiles/kamet0',
      request.url,
    ),
  );
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/pt/ninho', '/en/ninho', '/es/ninho', '/fr/ninho'],
};
