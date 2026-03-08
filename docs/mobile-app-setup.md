# PAT PAT 모바일 앱 빌드 가이드

Next.js 웹앱을 Capacitor를 이용해 iOS / Android 네이티브 앱으로 패키징하는 과정입니다.

---

## 개요

| 항목 | 내용 |
|------|------|
| 방식 | Capacitor (WebView 래퍼) |
| 웹앱 연결 | Vercel 배포 URL (`https://pat-pat.vercel.app`) |
| Capacitor 버전 | v6 (Node 20 호환) |
| 관리 방식 | 모노레포 (웹/iOS/Android 단일 레포) |

> **WebView 방식이란?**
> 앱이 별도 로직 없이 배포된 웹사이트를 앱 껍데기 안에서 실행합니다.
> 웹 코드를 수정하고 Vercel에 배포하면 앱도 자동으로 반영됩니다.

---

## 사전 요구사항

### 공통
- Node.js 20+
- pnpm
- 프로젝트 의존성 설치 완료 (`pnpm install`)

### Android 빌드
- [Android Studio](https://developer.android.com/studio) 설치

### iOS 빌드 (macOS 전용)
- [Xcode](https://apps.apple.com/app/xcode/id497799835) 설치 (App Store)
- CocoaPods 설치

```bash
# CocoaPods 설치 확인
pod --version

# 없으면 설치
sudo gem install cocoapods
```

---

## 최초 세팅 (이미 완료된 작업)

> 이 섹션은 참고용입니다. 이미 설정 완료된 상태이므로 다시 실행하지 않아도 됩니다.

### 1. Capacitor 패키지 설치

```bash
pnpm add @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 @capacitor/ios@6
```

### 2. capacitor.config.ts 생성

프로젝트 루트에 `capacitor.config.ts` 파일을 생성하고 Vercel URL을 연결합니다.

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patpat.app',
  appName: 'PAT PAT',
  webDir: 'out',
  server: {
    url: 'https://pat-pat.vercel.app',
    cleartext: false,
  },
};

export default config;
```

### 3. Android / iOS 플랫폼 추가

```bash
npx cap add android
npx cap add ios
```

### 4. iOS CocoaPods 의존성 설치

```bash
cd ios/App && pod install && cd ../..
```

### 5. Capacitor 동기화

```bash
npx cap sync
```

---

## 클론 후 처음 세팅하는 경우

레포를 처음 클론한 팀원은 아래 순서로 진행합니다.

```bash
# 1. 의존성 설치
pnpm install

# 2. iOS CocoaPods 설치 (macOS, iOS 빌드 시)
cd ios/App && pod install && cd ../..

# 3. Capacitor 동기화
npx cap sync
```

---

## 개발 워크플로우

웹 코드를 수정한 후 Vercel에 배포되면 앱도 자동 반영됩니다.
네이티브 설정(아이콘, 권한 등)을 변경했을 경우에만 아래 명령을 실행합니다.

```bash
npx cap sync
```

---

## Android 앱 실행

### Android Studio에서 열기

```bash
npx cap open android
```

### 실행 방법

1. Android Studio 실행 후 Gradle Sync 완료 대기 (최초 1~3분 소요)
2. 상단 기기 선택 드롭다운에서 에뮬레이터 또는 연결된 실기기 선택
3. **Run ▶** 버튼 클릭

### APK 파일 생성

```
Android Studio 상단 메뉴
→ Build
→ Build Bundle(s) / APK(s)
→ Build APK(s)
```

생성된 APK 경로: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## iOS 앱 실행

> macOS + Xcode 설치 필수

### Xcode에서 열기

```bash
npx cap open ios
```

> **주의:** `.xcodeproj`가 아닌 `.xcworkspace` 파일로 열어야 합니다.
> 직접 열 경우 아래 경로를 사용하세요.

```bash
open ios/App/App.xcworkspace
```

### 실행 방법

1. Xcode 좌측 사이드바(`Cmd + 1`)에서 `App` 프로젝트 선택
2. 상단 기기 선택 드롭다운에서 시뮬레이터 또는 연결된 실기기 선택
3. **Run ▶** 버튼 클릭

---

## 트러블슈팅

### Xcode에서 "No Editor" / 파일 트리가 비어있음

`npx cap sync`가 실행되지 않아 필요한 파일이 없는 경우입니다.

```bash
npx cap sync ios
cd ios/App && pod install
```

이후 Xcode에서 "Use on Disk" 선택하거나 Xcode를 재시작합니다.

### Capacitor CLI 실행 시 `NodeJS >=22.0.0` 오류

Capacitor v8은 Node 22가 필요합니다. 이 프로젝트는 Node 20 호환인 **v6**을 사용합니다.
패키지 버전이 v8로 올라갔다면 아래 명령으로 재설치합니다.

```bash
pnpm add @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 @capacitor/ios@6
```

### iOS 빌드 시 `No such file or directory` 오류

CocoaPods 의존성이 설치되지 않은 경우입니다.

```bash
cd ios/App && pod install
```

---

## 프로젝트 구조

```
PAT_PAT/
├── src/                    # Next.js 웹앱 소스
├── android/                # Capacitor Android 네이티브 프로젝트
│   ├── app/
│   └── ...
├── ios/                    # Capacitor iOS 네이티브 프로젝트
│   └── App/
│       ├── App/
│       ├── App.xcworkspace  # ← Xcode는 이 파일로 열 것
│       └── Podfile
├── capacitor.config.ts     # Capacitor 설정 (Vercel URL 등)
└── package.json
```

---

## Git 관리 정책

`android/`, `ios/` 폴더는 git으로 관리합니다.
빌드 산출물과 로컬 환경 파일은 `.gitignore`에서 제외합니다.

| 추적 O | 추적 X |
|--------|--------|
| `android/`, `ios/` | `android/build/`, `android/.gradle/` |
| `capacitor.config.ts` | `ios/App/Pods/` |
| 앱 아이콘, 권한 설정 | `local.properties`, `xcuserdata/` |

> `Pods/`는 `pod install`로 재생성되므로 커밋하지 않습니다. (`node_modules`와 동일한 개념)
