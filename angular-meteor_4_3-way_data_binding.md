#  [angualr-meteor] 4. 3-way Data Binding
- [이 페이지에서 다루는 내용](https://angular-meteor.com/tutorials/socially/angular2/3-way-data-binding)



- 이제 자체 데이터를 생성하고, 렌더링하는 클라이언트 측 application은 있다.
- meteor가 아닌 다른 프레임워크에 있다면 서버를 클라이언트에 연결하는 일련의 REST endpoints를 구성, 구현해야하기 시작할 것이다. 
- 또한 우리는 데이터베이스와 연결할 함수를 만들어야 한다.
- 그리고 우리는 심지어 실시간(realtime)에 대해서도 이야기하지 않았다. 
        -  이 경우, soket과 local DB를 캐시에 추가하고 대기 시간 보정을 처리해야한다(아니면 이러한 기능을 무시하고 별로 좋지않거나, 덜 현대적인 프로그램을 만들어야 한다.).

**우리는 운이 좋게도, meteor를 사용한다!**


## Data Model and Reactivity in Meteor

- Meteor는 마치 로컬 데이터베이스와 이야기하는 것처럼 간단한 **분산 클라이언트 코드**를 작성한다.
- 모든 Meteor 클라이언트는 메모리 내 데이터베이스 캐시를 포함한다. 
- 클라이언트 캐시를 관리하기 위해 서버는 JSON문서 집합을 게시하고 클라이언트는 이 집합을 구독한다. 
- document의 설정이 변경되면, 서버는 각 클라이언트의 캐시를 자동으로 패치한다.
- 이것은 우리에게 새로운 개념인 `Full Stack Reactivity`를 소개한다.

- Angular-ish 언어에서는 _3-way data binding_ 이라고 부를 수 있다.
- Meteor에서 데이터를 처리하는 방법은 `Mongo.Collection` 클래스를 사용하는 것이다.
        - MongoDB collection을 선언하고 조작하는 데 사용된다.

- Meteor의 클라이언트 측 Mongo 에뮬레이터인  [MiniMongo](https://atmospherejs.com/meteor/minimongo?__hstc=219992390.f559b922cef3716a3d9651b20a9eafe3.1478337689674.1480431141630.1480435022057.7&__hssc=219992390.3.1480435022057&__hsfp=3744739253) 덕분에 `Mongo.Collection`은 클라이언트와 서버 코드 모두 사용할 수 있다.

요약하면, meteor의 core 설정은 다음과 같다.

- 웹소켓을 통한 실시간 반응성
- 두 개의 데이터베이스
        - 하나는 클라이언트의 빠른 변경
        - 다른 하나는 서버의 공식적인 변경
- 두 데이터베이스 간의 데이터를 동기화하는 특수 프로토콜(DDP)
- Meteor로 앱을 만드는 더 쉽고 더 많은 개발자 친화적인 작은 것들


## RxJS and MongoObservable


- Angular2-Meteor 팀은 `Meteor-rxjs`라는 추가 패키지를 제공하여 meteor의 원래 API를 래핑하고 콜백 또는  Promise를 사용하는대신 RxJS Observable을 return 한다.
- `Observable`은 Promise와 매우 유사하며, multiple `resolve`를 의미하는 지속적인 flow만 있다.

`Observable`의 라이프사이클은 세 부분으로 구성된다.

- `next` : Observable의 변경 때마다 매번 호출된다.
- `error` :  오류가 발생했을때 
- `complete` : data flow가 완료되었을 때 

Meteor 세계와 Mongo Collection 세계를 연결하려고하면 collection이 변경될 때 마다 `next` 콜백이 호출되고 reactive data를 사용하기때문에 `coplete`를 호출해서는 안되며, 더 많은 업데이트가 있을때까지 기다릴 것이다.


Angular2는 Meteor의 API대신 RxJS `Observable`을 지원하고, 이것의 기능이 필요한 사람들에게 좋은 기능을 제공하고있다.  사용하며 객체 반복및 빠른 Change Detection 등.

 `Observable`과 RxJS에 대해서 더 알고싶다면 [여기](http://reactivex.io/documentation/observable.html)를 참조하자.

 > RxJS 문서는 처음 보기에 위협적(?)일 수 있다. 너무 어려운 경우, 이 튜토리얼에서 사용하는 예제를 보면 이해가 쉽다.


## 컬렉션 선언 <sub>Declare a Collection</sub>

- 먼저, parties를 저장하는 우리의 첫 parties collection을 정의한다.
- 우리는 `MongoObservable` static method를 컬렉션(Collection)을 선언하기위해 사용한다.
- 따라서 우리는 `both/collection/parties.collection.ts` 파일을 추가한다.


### Add Parties collection
_both/collection/parties.collection.ts_
```
import { MongoObservable } from 'meteor-rxjs';

export const Parties = new MongoObservable.Collection('parties');
```
우리는 여기서 `parties.collection.ts`라는 파일을 만들었는데, 여기에는 CommonJS 모듈들(`both`, `collections`, `parties`)을 포함되어있다.
        
- 이 작업은 백그라운드에서 TypeScript의 Compiler에 의해 수행된다.
- TypeScript 컴파일러는 ` .ts`파일을 `ES5`로 변환 한 다음,   CommonJS 모듈에 application의 상대경로와 같은 이름으로 등록(register)한다.
- 그래서 우리는 `export`라는 특수 단어를 사용한다.
- 우리는 CommonJS에게 객채가 이 모듈에서 외부로 내보지도록(exported) 말한다.


Meteor에는 `client/` 폴더를 포함하여 일련의 특수 폴더 이름이 있다. 
- `client/` 디렉토리 : 이 `client` 폴더 내의 모든 파일은 클라이언트에만 로드된다. 
- `serve/` 디렉토리 : 마찬가지로 serve라는 폴더의 파일은 서버에만 로드된다.
- 위 두 폴더 바깥에 배치하면, 해당 폴더의 내용을 클라이언트와 서버에서 모두 사용할 수 있다.
- 따라서 parties collection 은 클라이언트(minimongo)와 서버(Monggo) 모두에서 실행된다. 

비록 우리는 한 번만 모델을 선언(declaration)했지만, 우리는 두 module을 가지고 있다.
- 우리의 partiles collecion에 대한 두 가지 버전의 선언(declaration)
        - client-side 
        - server-side


이것은 종종 "isomorphic" 또는 "universal javascript"라고 불린다. 이 두 버전의 collection 간의 모든 동기화(synchronization)는 Meteor에 의해 처리된다.







## Binding Meteor to Angular

이제 우리는 Collection을 만들었으므로, 클라이언트는 변경 사항을 `subscribe` 하고 `this.parties` 배열에 바인딩해줘야한다.

일반적인 Meteor Collection 대신, `MongoObservable.Collection`을 사용하므로 Angular2는 이 유형의 데이터 객체를 쉽게 지원가능하며, 수정하지 않고 반복(iterate)할 수 있다.

그러면 collection으로부터 `Parties`를 가져오자(import).


_client/imports/app/app.component.ts_
//4.2 Import Parties collection

```typescript
import { Component } from '@angular/core';
import { Parties } from '../../../both/collections/parties.collection';
import template from './app.component.html';

@Component({
```

이제 우리는 Collection에 대한 질의를 생성할 것이고,  `MongoObservable`을 사용했기 때문에, `find`의 반환값은 `Observable<any[]>`가 될 것이다. 
        - 이것은 Object 배열을 포함하는 Observable이다.

이제 그럼 `Observable`에 바인딩해보자!




_client/imports/app/app.component.ts_
//4.3 Bind MongoObservable to Angular

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../both/collections/parties.collection';

//... some lines skipped...
template
})

export class AppComponent {
        parties: Observable <any[]>;

        constructor(){
                //앞서 말했듯, find의 반환값은 observable이 될 것이다.
                this.parties = Parties.find({}).zone(); 
        }
}
```

> 우리는 약간의 매직을 수행하는 Observable에 대한 wrapper인 `zone()` 메서드를 사용했으며, component의 `Zone`을 사용하여  컬렉션 변경 사항을 view에 연결했따.

**이때문에, 우리는 `AsyncPipe`를 추가해야한다.**


_client/imports/app/app.component.html_
```html
<!-- 4.4 use AsyncPipe -->
<div>
        <ul>
                <li *ngFor="let party of parties | async">
                {{party.name}}
                <p>{{party.description}}</p>
                <p>{{party.location}}</p>
                </li>
        </ul>
</div>
```




## Inserting Parties from the Console

- 이 시점에서 우리는 페이지에 `Parties` 목록을 렌더링하는 것을 구현했다.
- 이제 위의 코드가 실제로 동작하는지 확인해야한다.
- 이 목록을 렌더링 할 뿐만 아니라 페이지의 데이터베이스에 대한 모든 변경사항을 반응적으로(reactively) 렌더링해야한다.

- Mongo 용어에서 Collection 내부의 `item`은  `documents`라고 불린다.
- 이제 서버 데이터베이스 콘솔을 사용하여 일부 `documents`를 우리 `collection`에 삽입해보자.

새로운 터미널을 열고, app디렉토리로 이동한 뒤, 다음을 타이핑한다.
```
meteor mongo
``` 

[Mongo Shell](https://docs.mongodb.org/manual/reference/mongo-shell/)을 사용하여 app의 로컬 개발 데이터베이스에 콘솔을 연다. 명령프롬프트에서 다음을 입력하세요

```
db.parties.insert({ name: "새로운 파티", description: "mongo console로 부터", location: "데이터베이서 안에서" });
```

웹 브라어저에서 app의 UI가 즉시 업데이트되어 새로운 파티를 표시한다. 서버 측 데이터베이스를 프론트엔드 코드에 연결하는 코드를 작성할 필요가 없음을 알 수 있다. 자동으로 이러한 동작이 발생했다.

다른 텍스트로 데이터베이스 콘솔에서 추가해보자.

이번에는 데이터베스에서 제거하는 것을 동일한 원리로 해보자. 프롬프트에서 다음을 타이핑해본다.

```
db.parties.find({});
```
위 명령어에 대한 결과는 다음과 같다.

```
{ "_id" : ObjectId("583e9d78e70aceccd53cc0ff"), "name" : "A new party", "description" : "F
rom the mongo console!", "location" : "In the DB" }
{ "_id" : ObjectId("583e9e4ee70aceccd53cc100"), "name" : "새로운파티", "description" : "한
글로작성한 파티", "location" : "연신내 갈현동" }
```

제거하고자하는 party의 id를 찾아 복사한다. 그런다음 다음 코드에서 빈 영역에 해당 party의 id를 넣어준다.

```
db.parties.remove({"_id": ObjectId("__________")})
```

작성후 app을 확인하면 UI에서 해당 party요소가 삭제되어있는 것을 볼 수 있다.



##서버측 데이터 초기화 <sub>Initializing Data on Server Side</sub>

- 지금까지는 mongo 콘솔을 사용하여 party documents를 collection에 삽입했다.
- 사실, 일부 초기 데이터를 데이터베이스에 미리 로드하는 것이 더 편하다.
- 이제까지와 같은 parties로 서버측 데이터를 초기화해보자.

- `server/imports/fixtures/parties.ts`를 생성한다.
- `parties.ts` 내부에 `loadParties` 메소드를 구현하여 party를 로드하자.


_server/imports/fixtures/parties.ts_

```typescript
//4.5 Add initial parties

import { Parties } from '../../../both/collections/parties.collection';
 
export function loadParties() {
  if (Parties.find().cursor.count() === 0) {
    const parties = [{
      name: 'Dubstep-Free Zone',
      description: 'Can we please just for an evening not listen to dubstep.',
      location: 'Palo Alto'
    }, {
      name: 'All dubstep all the time',
      description: 'Get it on!',
      location: 'Palo Alto'
    }, {
      name: 'Savage lounging',
      description: 'Leisure suit required. And only fiercest manners.',
      location: 'San Francisco'
    }];
 
    parties.forEach((party) => Parties.insert(party));
  }
}


```

그리고나서, Meteor가 시작할 때 이것이 실행할 수 있도록  `main.ts`파일을 생성한다.

> meteor의 실행순서를 기억하자.


_server/main.ts_

```typescript
import { Meteor } from 'meteor/meteor';
 
import { loadParties } from './imports/fixtures/parties';
 
Meteor.startup(() => {
  loadParties();
});
```