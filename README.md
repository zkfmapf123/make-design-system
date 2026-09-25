# make-design-system

Claude Code용 디자인 시스템 skill.

벤치마킹할 URL 하나를 주면 레퍼런스를 분석하고, **구조부터 서로 다른 디자인 후보 5개를 HTML로 만들어** 보여준다.
사용자가 하나를 고르거나 섞으면(`03 레이아웃 + 04 모션`) 그 후보를 **디자인 시스템**(토큰·컴포넌트·문서)으로 완성한다.
레퍼런스는 분석만 하고 결과물에는 절대 넣지 않는다.

## 포함된 Skill

| Skill | 언제 동작하나 | 무엇을 하나 |
|---|---|---|
| **make-design-system** | 레퍼런스 URL을 주며 "이 사이트처럼", "벤치마킹", "디자인 시스템 만들어" 라고 할 때 | 분석 → 금지 목록 → 후보 5개 병렬 제작·검증 → 선택 → 디자인 시스템 생성 |

## 흐름

```
/make-design-system https://reference.example.com
 0 사전 점검     taste-skill 설치 확인, scripts/setup.sh (puppeteer + sharp 로컬 설치)
 1 캡처·분석     PC·모바일·메뉴 스크린샷, 계산된 스타일, CSS 변수, 공개 CSS/JS → .benchmark/REFERENCE.md
 2 금지 목록     레퍼런스의 섹션 순서·시그니처 컴포넌트·내비·모션·브랜드 → .benchmark/BANNED.md
 3 방향 제안     패턴 카탈로그에서 5개                                  ← 사용자 확인
 4 병렬 제작     에이전트 5개 → candidates/NN-slug/index.html
 5 검증          콘솔 에러, 가로 넘침, 금지 패턴 grep
 6 비교 제시     Chrome으로 열기 (선택: zip / S3 업로드)
 7 디자인 시스템                                                       ← 사용자 선택
                 기본: tokens.css · DESIGN-SYSTEM.md · components.html
                 선택: W3C DTCG json · Tailwind · Figma Tokens Studio · Claude Design System 아티팩트
```

패턴 카탈로그(초기 5개): Minimal Editorial · Industrial Signal · Soft Premium · Kinetic Cinema · Playful Pop (+ 확장 시드 5개).

## 설치

### GitHub에서 (plugin)

```
/plugin marketplace add zkfmapf123/make-design-system
/plugin install make-design-system@make-design-system
```

### GitHub에서 (skills CLI)

```bash
npx skills add zkfmapf123/make-design-system -a claude-code      # 프로젝트
npx skills add zkfmapf123/make-design-system -a claude-code -g   # 전역
```

### 로컬에서 (clone한 경우)

```
/plugin marketplace add <clone한-절대경로>
/plugin install make-design-system@make-design-system
```

### 필수 skill

후보 제작에 [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)을 사용한다. 없으면 첫 실행 때 확인 후 설치한다.

```bash
npx skills add Leonxlnx/taste-skill -s '*' -a claude-code -y
```

## 요구 사항

- Node 18+
- 첫 실행 시 `scripts/setup.sh`가 puppeteer + sharp + chrome-headless-shell을 **skill 폴더 안에만** 설치 (약 250MB, 전역 설치 없음)
- 선택: macOS Chrome (6단계 열기), AWS CLI (S3 업로드)

## 스크립트 (`skills/make-design-system/scripts/`)

| 명령 | 역할 |
|---|---|
| `bash setup.sh` | 최초 1회 로컬 설치, 이후 `ready`만 출력 |
| `node bds.mjs capture <url> --out .benchmark` | analysis.json, rendered.html, src/ |
| `node bds.mjs shots <url\|file> --out dir` | 화면 단위 PC·모바일 스크린샷 + 메뉴 열림 |
| `node bds.mjs verify <url\|file>` | 콘솔 에러·가로 넘침 검사, 실패 시 exit 1 |
| `node bds.mjs grid <dir> --prefix d` | 스크린샷 묶음 이미지 |
| `bash publish-s3.sh candidates <bucket> [prefix] [domain]` | zip + `*/index.html`만 업로드 |

## 산출물

```
<프로젝트>/
├── .benchmark/        분석 전용 — 절대 배포/업로드 안 함
├── candidates/NN-slug/index.html
└── design-system/     tokens.css, DESIGN-SYSTEM.md, components.html (+ 선택 형식)
```

## 비용

후보 1개당 약 10~18만 토큰. 5개면 한 번에 50~90만 토큰, 병렬로 약 10~15분. 3단계에서 3개로 줄일 수 있다.

## License

MIT
