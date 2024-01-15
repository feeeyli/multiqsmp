import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/purgatory')) {
    const toRewrite = ['pt', 'en', 'es', 'fr'].some((loc) =>
      request.nextUrl.pathname.includes(loc),
    )
      ? request.nextUrl.pathname.replace('/purgatory', '')
      : '/';

    return NextResponse.rewrite(new URL(toRewrite, request.url));
  }

  if (request.nextUrl.pathname.endsWith('/ninho')) {
    return NextResponse.redirect(
      new URL(
        request.nextUrl.pathname.slice(0, 3) +
          '?streamers=qsmp/BadBoyHalo/fitmc/Foolish/ironmouse/jaidenanimations/lenay/nihachu/philza/quackity/slimecicle/tinakitten/tubbo/TubboLIVE/wilbursoot/carreraaa/elmariana/quackitytoo/germangarmendia/luzu/agentemaxo/missasinfonia/polispol1/rivers_gg/roier/rubius/vegetta777/willyrex/bagi/cellbit/felps/linkthemike/peqitw/antoinedaniel/aypierre/bagherajones/etoiles/kamet0&chats=qsmp/BadBoyHalo/fitmc/Foolish/ironmouse/jaidenanimations/lenay/nihachu/philza/quackity/slimecicle/tinakitten/tubbo/TubboLIVE/wilbursoot/carreraaa/elmariana/quackitytoo/germangarmendia/luzu/agentemaxo/missasinfonia/polispol1/rivers_gg/roier/rubius/vegetta777/willyrex/bagi/cellbit/felps/linkthemike/peqitw/antoinedaniel/aypierre/bagherajones/etoiles/kamet0',
        request.url,
      ),
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/pt/ninho',
    '/en/ninho',
    '/es/ninho',
    '/fr/ninho',
    '/purgatory',
    '/purgatory/:locale*',
  ],
};
