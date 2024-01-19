import { ImageResponse } from 'next/server';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge';

export async function GET() {
  const poppins400 = await fetch(
    new URL(
      '../../../../../public/poppins/Poppins-Regular.ttf',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  const poppins600 = await fetch(
    new URL(
      '../../../../../public/poppins/Poppins-SemiBold.ttf',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          fontFamily: '"Poppins"',
        }}
      >
        <div tw="bg-[#1e1a23] flex w-full flex-1 items-center justify-center">
          <div tw="flex flex-col items-center">
            <h1
              tw="mb-2 text-[#f9fafb] text-[160px]"
              style={{ fontWeight: 700 }}
            >
              MultiQSMP
            </h1>
            <div tw="flex">
              <div tw="flex flex-col items-center mr-[80px]">
                <h2 tw="text-[#bfa9e5] text-[60px]" style={{ fontWeight: 400 }}>
                  Bem-vindo
                </h2>
                <h2 tw="text-[#bfa9e5] text-[60px]" style={{ fontWeight: 400 }}>
                  Welcome
                </h2>
              </div>
              <div tw="flex flex-col items-center">
                <h2 tw="text-[#bfa9e5] text-[60px]" style={{ fontWeight: 400 }}>
                  Bienvenido
                </h2>
                <h2 tw="text-[#bfa9e5] text-[60px]" style={{ fontWeight: 400 }}>
                  Bienvenu
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Poppins',
          data: poppins400,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Poppins',
          data: poppins600,
          weight: 600,
          style: 'normal',
        },
      ],
    },
  );
}
