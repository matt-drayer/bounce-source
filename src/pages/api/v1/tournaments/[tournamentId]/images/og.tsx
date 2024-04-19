import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { OG_PIXEL_HEIGHT, OG_PIXEL_WIDTH } from 'constants/media';
import { fetchTournamentById } from 'services/server/airtable/edge';
import { mapToUsDate } from 'utils/shared/date/mapToUsDate';

export const config = {
  runtime: 'edge',
};

const DEFAULT_TIMEZONE = 'America/New_York';

// NOTE: Need a much better way to do this and in a more generic way.
// I imagine Vercel will add some way to infer it from the route path. (seems like we can with nextUrl.searchParams.get('param))
// Or can I use new URLSearchParams()? It looks like it has a similar API.
// https://github.com/vercel/examples/blob/main/edge-api-routes/query-parameters/api/edge.ts ----- THIS WORKS! Or at least did on Arena landing page
const POSITION_OF_ID_IN_URL = 3;
const extractTournamentSessionId = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname.slice(1);
  const tournamentId = pathname.split('/')[POSITION_OF_ID_IN_URL];

  return tournamentId;
};

const fontRegular = fetch(
  new URL('../../../../../../../assets/Inter-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());
const fontBold = fetch(new URL('../../../../../../../assets/Inter-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

export default async function handler(request: NextRequest) {
  const fontDataRegular = await fontRegular;
  const fontDataBold = await fontBold;

  const tournamentId = extractTournamentSessionId(request);
  const tournament = await fetchTournamentById(tournamentId);
  const test = request.nextUrl.searchParams.get('tournamentId');

  if (!tournament) {
    return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
  }

  const startDate = mapToUsDate(tournament.startDate);
  const endDate = mapToUsDate(tournament.endDate);

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FF4229',
          width: '100%',
          height: '100%',
          padding: '40px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div tw="flex flex-col w-full">
          <div tw="flex justify-between w-full">
            <div tw="flex flex-col">
              {!!tournament.title && (
                <h1
                  tw="font-bold mt-6"
                  style={{
                    fontFamily: '"Inter"',
                    fontSize: '56px',
                    lineHeight: 1,
                    display: 'flex',
                    color: 'white',
                  }}
                >
                  {tournament.title}
                </h1>
              )}
              <h2
                tw="font-normal mt-6"
                style={{
                  fontFamily: '"Inter"',
                  fontSize: '28px',
                  color: 'white',
                  lineHeight: 1,
                  display: 'flex',
                }}
              >
                {startDate} - {endDate}
              </h2>
              <div
                tw="mt-8 flex text-2xl text-gray-200"
                style={{ width: '800px', lineHeight: 1.65 }}
              >
                {tournament.description}
              </div>
            </div>
          </div>
        </div>
        <div tw="flex justify-between items-center w-full">
          <div tw="flex flex-col">
            <div tw="flex text-white text-3xl font-bold">Pickleball Tournament</div>
            <div tw="flex text-gray-200 text-xl">Hit different</div>
          </div>
          <div tw="flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 29" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.69766 0.0209198H0V28.326H6.51576V24.6852C8.32313 27.2584 10.9814 28.9791 14.5136 28.9791C20.6525 28.9791 25.122 24.4918 25.122 17.7788C25.122 11.0747 20.6394 6.57847 14.5136 6.57847C11.107 6.57847 8.50348 8.19406 6.69766 10.6295V0.0209198ZM12.5437 11.8995C15.7144 11.8995 18.3496 14.61 18.3496 17.7788C18.3496 20.9778 15.7376 23.658 12.5437 23.658C9.13702 23.658 6.63368 21.0375 6.63368 17.7788C6.63368 14.5201 9.16939 11.8995 12.5437 11.8995Z"
                fill="#FFFFFF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M27.1267 17.7788C27.1267 25.7214 33.617 28.9791 40.0958 28.9791C46.5946 28.9791 53.1003 25.7427 53.1003 17.7788C53.1003 9.82608 46.5799 6.57847 40.0958 6.57847C33.6139 6.57847 27.1267 9.83859 27.1267 17.7788ZM46.3279 17.7788C46.3279 21.5592 43.6111 23.7696 40.0958 23.7696C36.5974 23.7696 33.8629 21.533 33.8629 17.7788C33.8629 14.0472 36.6074 11.7879 40.0958 11.7879C43.601 11.7879 46.3279 14.0209 46.3279 17.7788Z"
                fill="#FFFFFF"
              />
              <path
                d="M64.8139 28.9419C59.1344 28.9419 55.7717 24.6909 55.7717 19.0067V7.17383H62.4716V18.002C62.4716 20.9882 64.0254 23.3231 67.0829 23.3231C70.4055 23.3231 72.3069 20.6925 72.3069 17.4067V7.17383H79.0069V28.3207H73.4353L72.646 24.1312C71.0321 26.9503 68.3839 28.9419 64.8139 28.9419Z"
                fill="#FFFFFF"
              />
              <path
                d="M88.8422 7.17383H83.2097V28.3207H89.9104V18.1509C89.9104 14.8308 91.9929 12.2344 95.314 12.2344C98.4432 12.2344 100.177 14.4685 100.177 17.5927V28.3207H106.878V16.5508C106.878 10.7787 103.283 6.57847 97.5838 6.57847C94.2959 6.57847 91.4003 8.35754 89.6314 11.1738L88.8422 7.17383Z"
                fill="#FFFFFF"
              />
              <path
                d="M134.556 19.5649C133.922 25.7116 128.186 28.9791 122.128 28.9791C115.135 28.9791 109.555 24.7944 109.555 17.7788C109.555 10.7632 115.135 6.57847 122.128 6.57847C128.184 6.57847 133.93 9.84582 134.556 15.9927H127.891C127.351 13.203 124.822 11.7879 122.128 11.7879C118.585 11.7879 116.292 14.2837 116.292 17.7788C116.292 21.2739 118.585 23.7696 122.128 23.7696C124.813 23.7696 127.324 22.3308 127.891 19.5649H134.556Z"
                fill="#FFFFFF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M136.283 17.7044C136.283 24.9356 142.632 28.9791 149.072 28.9791C152.77 28.9791 156.554 28.0423 159.627 25.8534L157.179 21.6805C155.09 23.0344 152.801 23.8478 150.351 23.8478C147.07 23.8478 144.306 22.7626 143.428 19.8253H159.904C160.748 12.4852 155.925 6.57847 148.568 6.57847C142.262 6.57847 136.283 10.7253 136.283 17.7044ZM143.21 15.4717H153.84C153.245 13.1549 151.597 11.5646 148.676 11.5646C146.002 11.5646 143.844 12.82 143.21 15.4717Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_PIXEL_WIDTH,
      height: OG_PIXEL_HEIGHT,
      fonts: [
        {
          name: 'Inter',
          data: fontDataRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fontDataBold,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
