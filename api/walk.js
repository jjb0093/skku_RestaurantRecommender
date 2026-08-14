const KAKAO_WALK_URL = "https://dapi.kakao.com/v2/routing/walk";

const ALLOWED_PARAMS = new Set([
  "start_x", "start_y", "end_x", "end_y",
  "s_name", "e_name",
  "input_coord", "output_coord", "route_mode",
  "via_x", "via_y", "v_name"
]);

export function GET(request) {
  return handle(request);
}

async function handle(request) {
  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return Response.json(
      { message: "Vercel 환경변수 KAKAO_REST_API_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const incoming = new URL(request.url);
    const params = new URLSearchParams();

    for (const [key, value] of incoming.searchParams.entries()) {
      if (ALLOWED_PARAMS.has(key) && value !== "") params.append(key, value);
    }

    for (const required of ["start_x", "start_y", "end_x", "end_y"]) {
      if (!params.has(required)) {
        return Response.json(
          { message: `필수 좌표 파라미터가 없습니다: ${required}` },
          { status: 400 }
        );
      }
    }

    const kakaoResponse = await fetch(`${KAKAO_WALK_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${apiKey}`,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    const body = await kakaoResponse.text();
    return new Response(body, {
      status: kakaoResponse.status,
      headers: {
        "Content-Type": kakaoResponse.headers.get("content-type") || "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Kakao walking route proxy error", error);
    return Response.json(
      { message: "카카오 도보 경로 요청 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
