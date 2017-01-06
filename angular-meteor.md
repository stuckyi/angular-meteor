# Bootstrap
DEPLOY_HOSTNAME=stuckyistudio.meteor.com meteor deploy [stuckyistudio.meteor.com] --settings './settings.json'

ng2 Meteor Socially app을 만들어보자.

- meteor 설치, working app 생성
- app's structure에 익숙해지기 
- angular2 front end와 연결하기
- application을 브라우저에서 실행하기

## Meteor Setup

```
$ curl https://install.meteor.com/ | sh
```
github
```
git clone https://github.com/bsliran/angular2-meteor-base socially
```
```
cd socially
```
```
meteor npm install
```

```
meteor
```

새로운 `index.html`을 client 폴더에 생성한다. 그리고 다음 코드를 채워넣는다.

```html
<head>
        <base href="/">
</head>
<body>
        Hello World!
</body>
```
이렇게 파일을 구성하면 Meteor build tool이 자동으로 우리의 app을 업데이트 해준다.


- 우리 코드에는 `<html>` 태그가 없다.
        - meteor가 클라이언트에 파일을 제공하기 때문이다.
- meteor는 application의 모든 HTML 파일을 검색하여 함께 연결하기 때문에, 우리의 작업을 편하게 만들어준다.

- 연결(Concatenation)은 HTML파일안의 모든 HTML, HEAD 및 BODY 태그의 내용을 함께 병합하는 것을 의미한다.

- 그래서 우리의경우, meteor는 `index.html`파일을 찾았다. 이는 클라이언트 폴더 내부에 있기때문에 의마가 있으며, 내부에 BODY 태그가 있으며 기본생성 파일(main gerated file)의 `BODY` 태그에 추가가 되었다.


## TypeScript

Angular 2 Meteor app은 일반 자바스크립트(ES5), 새로운 자바스크립트(ES2015 또는 ES6)또는 서버와 클라이언트 모두의 TypeScript로 작성할 수 있다.

TypeScript는 Angular팀에서 권장하는 방법이므로, 이 튜토리얼에서는 TypeScript를 사용한다.


먼저 root 디렉토리에 있는 `tsconfig.json` 파일에 있는 Angular2.0 Meteor 앱을 실행하는 데 필요한 기본 구성이 있는지 확인해야 합니다.


```json
//tsconfig
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "es6",
      "dom"
    ],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": true
  },
  "exclude": [
    "node_modules"
  ],
  "files": [
    "typings.d.ts"
  ],
  "compileOnSave": false,
  "angularCompilerOptions": {
    "genDir": "aot",
    "skipMetadataEmit": true
  }
}
```

## @types

우리는 TypeScript가 의존하는 라이브러리의 모든 유형에 대해 알릴 필요가 있다.

이 단계에서 전체 유형 검사 지원을 추가하기 위해 TypeScript 선언 파일 인 `d.ts` 파일을 제공하는 npm 패키지를 사용합니다.

이것은 `typings.d.ts`라고하는 최상위 레벨 정의 파일이며, 다른 모든 유형 선언을 가져 오며 `tsconfig.json`파일은 이 파일을 가져온다.

이러한 저장소는  `@types`라고 불리며, 이미 Angular2 상용구에 있는 일부 저장소를 찾을 수 있다. 우리는 나중에 `@types`를 조금 더 추가하고 우리 자신의 일부를 수정할 것이다.

예를들어 `chai`와 같이 TypeScript로 작성되지 않은 패키지는 자체 `.d.ts` 파일을 제공하지 않으므로 이 패키지에 대한 TypeScript 지원을 받으려면 npm에서 `@types/chai`를 설치해야한다.


## Root Component

angular2의 코드는 component로 이루어진 트리 구조로 구성된다. 
- 각 component는 view가 붙여진(attached view) controller이다. 
이것이 트리구조이기 때문에, root component와 여기에서 벗어나는 brach component가 있어야 한다. 먼저 root component 부터 생성해보자.

### root component 생성하기 

클라이언트 폴더 내에 `app.componnet.ts`파일을 새로 만든다.

```typescript
import { Component } from '@angular/core';

@Component({
        selector:'app'
})
export class AppComponent { }
```
이제 template 파일을 생성해보자.


_client/imports/app/app.component.html_
```html
hello world
```
위 html파일을 활용하는 부분에 대해서 살펴보자.


_client/imports/app/app.component.ts_

```typescript
import { Component } from '@angular/core';
import template from './app.component.html';

@Component({
        selector: 'app',
        template
})
export class AppComponent { }
```

### About template
- `angular2-compilers` 패키지 덕분에, 모든 html 파일을 TypeScript 공간으로 모듈로 가져올 수 있다.
- 여기서 얻을 수 있는 것? : 간단하다. 문자열이다. 
- `angular2-compiler`는 html 파일의 내용을 문자열로 변환한다.


> component가 template 없이 존재하지 않으므로, (templateUrl과같은 )비동기 적으로 로드하는 대신 template을 문자열 메서드로 사용하는 것이 좋다. 우리가 생각하기에 이것은 component를 만드는 가장 좋은 방법이다.


마지막으로 Component를 `Bootstrap`하여 구성요소로 표시할 수 있습니다. 가장 먼저 할 일은 `<body>`에 `<app>`에 요소를 추가하는 것입니다.


```html
<!-- client/index.html-- >
...
<body>
        <app> Loading ... </app>
</body>
```
이제 root component가 생겼다!

### NgModel 만들기

`NgModel`은 angualr2d의 module을 를 정의한다. 
        - `use`, `decalrations`, `import`, `export`, `defines`을 요구(require)하거나, 선언(declare)하는 외부 모듈(external modules)
                - 이것은 bootstrap의 주요 구성 요소(main component)들이다.



[NgModel]에 대한 자세한 내용은 Angular2 문서를 참고하자.


```typescript
import { NgModuel } from '@angular/core';
import { BrowserModule } '@angular/platform-browser';

@NgModule({
        imports: [
                BrowserModule
        ]
})
export class AppModule { }
``` 
> 나중에 view template에서 사용할 기본적인 요소 및 내부적인  component인 `BrowserModule`을 가져온다.


- `AppComponent`를 `declarations`와 `bootstrap`에서 선언해준다.



```typescript
import { NgModuel } from '@angular/core';
import { BrowserModule } '@angular/platform-browser';

@NgModule({
        imports: [
                BrowserModule
        ],
        declarations: [
                AppComponent
        ],
        boostrap: [
                AppComponent
        ]
})
export class AppModule { }
``` 

- 이제 우리는 프로젝트의 "entry-point" 를  만들어야 한다.
- Meteor가 프로젝트를 시작할 때 이 파일을 로드하기 원하기 때문에, 클라이언트 디렉토리 아래에서 직접 만든다.

- `main entry` 파일은 새로운 `NgModel`과 함께` Angular2 boostrapMoudle`을 사용한다.


_client/main.ts__

```typescript
import 'angular2-meteor-polyfills';
import  { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './imports/app/app.module';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModue);

```

app을 실행시켜보자.

```
$ meteor
```

> 템플릿이 변경되지 않으면 브라우저가 원본 템플릿을 캐싱하고 있기 때문일 수 있다. Chome 개발중에 캐싱을 사용 중지하는 방법에 대해 알아보세요.

## npm

Meteor는 1.3부터 시작하는 NPM packages를 지원하며 프로젝트를 만들 때 `package.json`이라는 파일을 만들었다. 이 파일에는 프로젝트의 npm 종속성 및 기타 메타 데이터가 포함되어있다. 

현재 프로젝트의 dependencies를 설치하려면 `npm install`하세요


또한 우리는 Meteor package들을 `meteor add..`의 형태로 설치할 수 있다. `meteor`  패키지에는 npm에는 없는 기능들이 있기 때문에 우리는 `meteor add`의 형태로 몇 가지 기능을 사용할 것이다.



## ES6 Moudles and CommonJS

Meteor는 [ES6 modules](https://developer.mozilla.org/en/docs/web/javascript/reference/statements/import)를 바로(out of the box) 지원한다.

이 기능은 `import `/`export` 구문을 사용할 수 있는 기능을 제공하며, module load 및 dependency를 완벽하게 제어할 수 있다.

[Meteor 문서](http://docs.meteor.com/?__hstc=219992390.f559b922cef3716a3d9651b20a9eafe3.1478337689674.1480424958335.1480428841933.5&__hssc=219992390.1.1480428841933&__hsfp=3744739253#/full/modules)에서 모듈이 작동하는 방식과 CommonJS를 기반으로하는 방식에 대해 자세히 알아볼 수 있다.

