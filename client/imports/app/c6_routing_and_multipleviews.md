#
6. Routing and Multiple Views

* [원문 글](https://angular-meteor.com/tutorials/socially/angular2/routing-and-multiple-views)

이 챕터에서는 다음과 같은 내용을 살펴볼 수 있다.

* layout template 를 만드는 방법
* 새로운 ng2 router로 여러 view를 포함하는 App을 만드는 방법

**이 단계의 목표 : 선택한 Party 의 세부정보를 보여주는 하나 이상의 페이지를 App의 추가하기.**

기본적으로 App의 view에 표시되는 `parties` 의 `list` 가 존재하지만, 사용자가 이 list 중 특정 항목을 `click` 하면, App은 새로운 페이지로 이동하여 \(사용자가 선택한\) 정보를 표시해야한다.

## 6.1 Parties List component 생성하기

우리가 App에서 여러 view를 보기를 원하므로, 현재 **`parties`**의 목록을 별도의 **`component`**로 분리해야한다.

* **`app.component.ts`** 에서 **`parties-list.component.ts`** 로 분리한다.

`client/imports/app/parties/parties-list.component.ts`

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';

import template from './parties-list.component.html';

@Component({
selector: 'parties-list',
template
})
export class PartiesListComponent {
parties: Observable<Party[]>;

constructor(){
this.parties = Parties.find({}).zone();
}

removeParty(party:Party): void {
Parties.remove(party._id);
}
}
```

이 단계에서 우리가 한 일은 거의 없다.

- `Party collection`을 사용하여 모듈의 경로를 업데이트했다.
- template 이름의 변경
- selector가 `app`에서 `parties-list`로 변경
- class이름이 `AppComponent`에서 `PartiesListComponent`로 변경



### 6.2 `app.component.html`에서 `parties-list.component.html`로 element구조 복사


`parties-list.component.html`
```html
<div>
  <parties-form></parties-form>
 
  <ul>
    <li *ngFor="let party of parties | async">
      {{party.name}}
      <p>{{party.description}}</p>
      <p>{{party.location}}</p>
      <button (click)="removeParty(party)">X</button>
    </li>
  </ul>
</div>
```

`app.component.html`파일도 다음과 같이 변경한다.

`app.component.html`

```html
<div></div>
```

### 6.5 Add `Partieslist`를 `Parties declations`에 추가하기

`client/imports/app/parties/index.ts`

```typescript

import { PartiesFormComponent } from './parties-form.component';
import { PartiesListComponent } from './parties-list.component';

export const PARTIES_DECLARATIONS = [
        PartiesFormComponent,
        PartiesListComponent
];
```


## Routing

`@angular/router`는 Angular2에서 Routing을 담당하는 package이다. 여기서 어떻게 사용하는지 살펴보려고 한다.

- 이 package는 path를 정의하는 기능과, 정의한 것을 `NgModule`객체로 가져오는 기능을 제공한다.

### `routes` 정의하기

여기서 `route`를 array형태로 정의해야하는데, `Route` interface가 이러한 작업을 하는데 도움이 된다. 해당 객체의 속성이 제대로 정의되어있는지 확인 할 수 있다.

기본적인 두 가지 속성인 `path`와 `component`가 있다.

- `path` : `url`을 정의한다.
- `compoenent` : 여기(route)에 지정한 compoenent를 바인딩한다.

여기서 `routes`라는 변수명으로 `export`할 것이다.


### 6.5 `routes`를 정의하기

`client/imports/app/app.routes.ts`

```typescript
import { Route } from '@angular/route';

import { PartiesListComponent} from './parties/parties-list.component';

export const routes: Route[] = [
        { path: '', component: PartiesListComponent }
];
```

(여기서 `export`했으니) 이제 우리는 `routes` 변수를  `NgModule`안에서 사용할 수 있다. 조금 더 활용적으로 사용하기 위해, Angular2 에서 제공하는 `RouteModule`을 활용해서 별도의 routing module을 작성한다.




### 6.7 `RouterModule` 등록하기

`client/imports/app/app.module.ts`

```typescript

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { PARTIES_DECLARATIONS } from './parties';

@NgModule({
        imports:[
                BrowserModule,
                FormsModule,
                ReactiveFormModule,
                RouterModule.forRoot(routes);
        ],
        declations:[
                AppComponent,
        ]
})
```

### 6.8 `routerOutlet` implement


`client/imports/app/app.component.html`
```html
<div>
        <router-outlet></router-outlet>
</div>
```

이제 우리는 브라우저의 path와 URL에 기반한 router를 사용하기 때문에 Angular2 Router에 기본 path를 알려줄 필요가 있다.

다음 코드를 `client/index.html`에서 찾아보자(없으면 추가하자).
```html
<base herf="/">
```


## Parties Details

이제 우리의 app에 다른 view인 `PartiesListComponent`를 추가해보자.

이 component에서 아직 partie details를 가져올 수 없기 때문에, 우선 stub을 만들어두자.

작업이 끝나면 list에 있는 party를 클릭하면 더 많은 정보를 얻기위해 `PartyDetailsComponent`로 리디렉션 되어야한다.

### 6.9 `PartyDeatils` component를 추가하기

`client/imports/app/parties/parties-details.component.ts`

```typescript
import { Component } from '@angular/core';
import template from './party-details.component.html';

@Component({
        selector:'party-details',
        template
})
export class PartiesDetailComponent {

}
```


### 6.10 `parties-details.component.html` 추가

```html
<header>
        <h2>PARTY_NAME</h2>
        <p>PARTY_DESCRIPTION</p>
</header>
```

### 6.11 새로 작성한 `PartiesDetailComponent`를 `routes` 에 추가 


`client/imports/app/app.routes.ts`

```typescript
import { Route } from '@angular/router';

import { PartiesListComponent } from './parties/parties-list.component';
import { PartiesDetailsComponent } from './paties/parties-details.component';

export const routes: Route[] = [
        { path: '', component: PartiesListComponent },
        { path: 'party/:partyId', component: PartyDeatilsComponent }
];

```


### 6.11 새로 작성한 `PartiesDetailComponent`를 `declarations` 에 추가 


`client/imports/app/parties/index.ts`

```typescript
import { PartiesFormComponent } from './parties-form.component';
import { PartiesListComponent } from './parties-list.component';
import { PartiesDetailsComponent } from './parties-Details.component';

export const PARTIES_DECLARATIONS = [
        PartiesFormComponent,
        PartiesListComponent,
        PartiesDetailsComponent
];
```

보시다시피, 우리는 다음과 같은 방법을 사용했다.
`partyId`는 `path`의 문자열(string)안에 있다.  이렇게하면 매개변수를 정의할 수 있다. 
- 예를 들어, `localhost:3000/party/12`는 `PartyId` 매개 변수의 값으로 `12`를 사용하여 `PartiesDetailsComponent`를 가리킨다.

여기에 우리는 party details로 리디렉션되는 링크를 추가해야한다.




## RouterLink

`parties`의 `list`에 세부정보보기(details view)에 대한 링크를 추가해보자.


~~As we've already seen, each party link consists of two parts: the base PartyDetailsComponent URL and a party ID, represented by the partyId in the configuration.~~

```
이미 살펴봤듯이, 각 `party` link는 두 가지 요소로 구성되어있다.
- `PartyDetailsComponent`의 `URL`
- component의 `partyId`
```

### `routerLink` Directive
`routerLink`라는 특별한 지시자(directive)가 있는데, 이것은 각 `URL`을 작성하는데 도움이 된다.
 
이제 우리는 `routerLink`에서 `party`를 감싸(wrap)고, `_id`를 parameter로 전달할 수 있다. 

> **NOTE** 아이템이 `Mongo Collection`에 삽입될 때, `id`가 자동생성(auto-generated)된다.


### 6.12 `PartiesListComponent`에서 `routerLink` 사용하기

`client/imports/app/parties/parties-list.component.html`

```html
<ul>
        <li *ngFor="let party of parties | async">
                <a [routerLink]="['/party', party._id]"> {{party.name}}</a>
                <p>{party.description}}</p>
                <p>{{party.location}}</p>
                <button (click)="removeParty(party)">X</button>
        </li>
</ul>
```

보시다시피, array를 사용했다. 

```html
<a [routerLink]="['/party', party._id]"> {{party.name}}</a>
```
- `'/party'` : 사용할 경로(path)다.
- `party._id` : 매개변수의 값을 제공하는 것이다.


> **NOTE** : 하나 이상의 매개변수를더 추가해서 사용가능하다.



## Injecting Route Parmas

방금 `PartiesDetails`의 view에 대한 link를 추가했다. 다음 살펴볼 것은, 사용자가 선택한 Party에 맞는 `PartyDetails`view를 로드하기위해,  `partyId` route parameter를 잡는(grab) 방법에 대해 살펴보려고한다.

Angular2에서는 이러한 작업을 `ActivatedRoute`라는 argument를 `PartyDetails` constructor로 간단히 넘겨주는 방법으로 처리한다.


### 6.13 get the `PartyId`를 Subscribe하기 


`client/imports/app/parties/party-details.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/map';

import template from './party-details.component.html';

@Component({
        selector : 'party-details,
        template
})

export PartyDetailsComponent {
        partyId: string;

        constructor(
                private route: ActivatedRoute
        ){}

        ngOnInit(){
                this.route.params
                        .map(parmas => params['partyId'])
                        .subscribe(partyId => this.partyId = partyId);
        }
}
        
```

> **NOTE** : `map`이라는 또다른 `RxJS` 기능을 활용하여 data stream을 다른 객체로 변환(transform)한다. 이 경우에는 `params`에서 `partyId`를 가져오고, 이 함수의 반환 값을 `subscribe`한다. 그러면 `subscribe`가 우리가 필요한 `partyId`만 호출한다.

>  **NOTE** :  We used another RxJS feature called map - which transform the stream of data into another object - in this case, we want to get the partyId from the params, then we subscribe to the return value of this function - and the subscription will be called only with the partyId that we need.



##### Dependency Injection with Angular2

`Dependency Injection`은 Angular2를 사용하여 scene 뒤에서 모든 작업을 수행한다. 

- TypeScript는 이 class를 class의 metadata을 바탕으로 compile한다.
        - class의 metadata : 이 class가 생성자(constructor)에서 기대하는 인수 유형(즉, `ActivatedRoute`)을 말한다.

따라서, 이 class의 instance를 생성할 때, Angular2는 어떤 type으로 삽입(inject)할지를 알고있다.

```typescript
//...
        constructor(route: ActivatedRoute){}
```

그런다음, party detail linke를 click할 때, `router-outlet` directive는 `ActivatedRoute` provider를 만드는데, 이 `ActivatedRoute` provider가 현재 `URL`에 대한 param을 provide하는 역할을 한다.
        - >왜 현재 URL에 대한 param이 필요한지 생각해보자.



- `PartyDetails` instance 가 Dependency Injection API를 통해 생성 된 순간,`ActivatedRoute`가 생성되고 constructor 내부의 현재 `URL`과 동일하게 생성된다.

```typescript
//...
 ngOnInit() {
    this.route.params
      .map(params => params['partyId'])
      .subscribe(partyId => this.partyId = partyId);
  }
//...
```

ng2의 Dependency Injection에 대해서 더 자세히 읽고 싶다면 이 [article](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)에서 자세히 볼 수 있고, class metadata에 대해서는 이 [article](http://blog.thoughtram.io/angular/2015/09/17/resolve-service-dependencies-in-angular-2.html)을 참고하자.

다음으로, memory leaks(메모리 누수)와 performance issues를 피하기 위해, 우리는 Component에서 `subscribe`을 사용할 때마다 같이 고려해봐야할 것이 있다. `subscribe`하고있는 데이터가 더이상 흥미롭지 않을 때 `subscribe`를 취소하는 것이다.

이렇게 하기 위해서는 `OnDestroy`라는 ng2의 interface를 사용하고 `ngOnDestroy`를 구현(implement)한다. 
- `ngOnDestroy` : Component가 더 이상 view에 없고, DOM에서 제거되었을 때 호출된다.
다음과 같이 구성한다.

### 6.14 Component가 destroy될 때, Unscribe하기

`client/impports/app/parties/party-details.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/map';

import template from './party-details.component.html';


@Component({
        selector:'party-details',
        template
})

export class PartyDetailsComponent implements OnInit, OnDestroy {
        partyId: string;
        paramsSub: Subscription;

        constructor(private route: ActivatedRoute){}

        ngOnInit(){
                this.paramsSub = this.route.params
                        .map(params => params['partyId'])
                        .subscribe(partyId => this.partyId = partyId);
        }

        ngOnDestroy(){
                this.paramsSub.unsubscribe();
        }
}
```
이제 `Router` 에서 얻은 `ID`로 실제 `Party` object를 가져와야한다. 따라서 `Parties Collection`을 사용하여 가져오자.


### 6.15 party details를 load하기 

`client/imports/app/parties/party-details.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscrition';

import 'rxjs/add/operator/map';

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';

import template from './party-details.component.html';

@Component({
        selector:'party-details',
        template
})
export class PartyDetailsComponent implements OnInit, OnDestroy {
        partyId: string;
        paramsSub: Subscription;

        constructor(route: ActivatedRoute){}

        ngOnInit(){
                this.paramsSub = this.route.parmas
                        .map(params => params['partyId'])
                        .subscribe(partyId => {
                                this.partyId = partyId;
                                this.party = Parties.findOne(this.partyId);

                        }); 
                        
        }

        ngOnDestroy(){
                this.paramsSub.unsubscribe();
        }
}
```

> **NOTE** : `.findOne()`은 `Observable`또는 `Cursor`를 반환하는 대신 실제 객체(actural object)를 반환한다.


## Challenge

`partyDetails`에서 `PartiesList` Component에 다시 링크를 추가해보자.



## Summary


- app을 두 개의 main view로 나눈다.
- view를 사용하고, layout을 구성하기 위해 routing을 설정(config)한다.
- angular2에서 어떻게 dependency injection을 쓰는지 요약적으로 학습 
- injected route parameters and loaded party details with the ID parameter