# 밥약 Vercel 배포

## 파일 구조

- `index.html`: Kakao Maps JavaScript SDK 기반 지도/장소검색/UI
- `api/walk.js`: Kakao 도보 경로 REST API 프록시
- `package.json`: Vercel JavaScript Function용 ESM 설정
- `vercel.json`: 정적 사이트 설정

## Vercel 설정

1. 이 폴더를 GitHub 저장소 루트에 업로드합니다.
2. Vercel에서 저장소를 Import합니다.
3. Project → Settings → Environment Variables에서 다음 변수를 추가합니다.
   - Name: `KAKAO_REST_API_KEY`
   - Value: Kakao Developers의 REST API Key
   - Production / Preview / Development에 필요한 범위로 적용
4. 환경변수를 추가하거나 변경한 뒤에는 새 Deployment를 실행합니다.
5. Kakao Developers → 앱 → 플랫폼 → Web에 실제 Vercel 주소를 등록합니다.
   - 예: `https://babyak.vercel.app`
   - Preview 배포를 사용할 경우 필요한 Preview 주소도 등록해야 Kakao Maps JS SDK가 정상 동작합니다.

## 로컬 테스트

단순 Live Server로 `index.html`만 열면 `/api/walk` Function이 없으므로 도보 경로는 동작하지 않습니다.
Vercel CLI를 사용하는 경우 프로젝트 폴더에서 `vercel dev`로 프런트와 Function을 함께 테스트할 수 있습니다.

## 동작 흐름

1. Kakao Maps JS SDK로 캠퍼스/건물 좌표를 검색해 보정
2. 식당/카페 후보 검색
3. 브라우저가 같은 도메인의 `/api/walk` 호출
4. Vercel Function이 REST Key를 붙여 Kakao `/v2/routing/walk` 호출
5. `totalTime`, `totalDistance`, `legs[].steps[].path.points`를 프런트로 반환
6. 실제 보행 경로 좌표를 Kakao Polyline으로 렌더링
