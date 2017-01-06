# 5. Data Management
---
- [원문](https://www.coshx.com/blog/2016/08/19/how-to-deploy-a-meteor-1-4-app-to-heroku/)

이제 서버에서 클라이언트로 전체 데이터 바인딩이 완료되었으니, 본격적으로 데이터와 interaction 해보고, action을 update 해보자.


이 챕터에서 다음을 다룬다.


- `party`를 추가하거나 제거할 새로운 component 생성
- `model-driven` form을 이해하고, 하나를 만들기
- form event와 coponent의 메서드를 연결하는 방법을 익히기
- `party` event handler를 추가, 제거 구현

먼저 새 파티를 추가하는 버튼이 있는 간단한 양식을 만들어본다.


## Component Architecture

- ng2에서는 root `App` component와 그에따르는 child component로 component tree를 구성했다.
- 그리고 각 child component에서 각각 나뭇잎(?)을 치듯 만들었다는 이야기

### `PartiesFormComponent`라는 이름으로 새로운 component를 생성하자.
- dir : `client/imports/app/parties`

> `imports`폴더는 Meteor의 새로운 폴더이다. app에서 사용하는 어떤 모듈이 다른 모듈을 import 할 경우, meteor는 여기에서 로드해온다.

#### 5.1 PartiesFormComponent 생성하기
_`client/imports/app/parties/parties-form.component.ts_

```typescript
import { Component } from '@angular/core';
 
import template from './parties-form.component.html';
 
@Component({
        selector: 'parties-form',
        template
})
export class PartiesFormComponent { }
```

- `PartiesFormComponent`를 ES6 module syntax를 사용하여 exporting하고 있다.
- 따라서 이 `PartiesFormComponent`를 다른 모듈에서 이용하기 위해서는 다음과 같이 입력해야한다.

```typescript
import { PartiesFormComponent } from 'client/imports/app/parties/parties-form.component';
``` 

새로운 component를 위한 template를 추가하자.


#### 5.2 Create PartiesForm 템플릿을 생성
_`client/imports/app/parties/parties-form.component.html_

```html
<form>
        <label> Name</label>
        <input type="text">

        <label>Description</label>
        <input type="text">

        <label>Location</label>
        <input type="text">
</form>
```

이 `PartiesForm` component를 `<parties-form>`태그를 root template인 `app.component.html`에 추가한다.

#### 5.3 PartiesForm을 App에 추가하기


`client/imports/app/app.component.html`
```typescript
`
//...
<div>
  <parties-form></parties-form>
  
  <ul>
    <li *ngFor="let party of parties | async">
      {{party.name}}
//...
`
```


#### 5.4 parties with decarations를 위한 index 생성

_`parties의` `index`를 `delcations`를 활용하여 생성_
_`clinet/imports/app/parties/index.ts`_

```typescript
import { PartiesFormComponent } from './parties-form.component';

export const PARITES_DECLARATIONS = [
        PartiesFormComponent
];
```




#### 5.5 parties decarations을 AppModule에 추가

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { PARITES_DECLARATIONS } from './parties';

@NgModule({
  // Components, Pipes, Directive
  declarations: [
    AppComponent,
    ...PARITES_DECLARATIONS
  ],
  // Entry Components
  entryComponents: [
    AppComponent
  ],
  // Modules
  imports: [
    BrowserModule
  ],
  // Main Component
  bootstrap: [ AppComponent ]
})
export class AppModule { }

```


>The ... is part of ES2016 language - it spreads the array like it was not an array, you can read more about it here.



## Angular2 Fomrs

다시 form으로 돌아가서, 이것을 functional하게 만들어보자.

### Model-drien Forms

form에 ng2의 기능을 사용하기 위해서 우리는 `FormsModule`을 우리의 `NgModule`에 import해줘야한다.

#### 5.6 Forms modules를 import하기

`client/imports/app/app.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { AppComponent } from './app.component';
import { PARTIES_DECLARATIONS } from './parties';
 
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
```
form model을 구성해보자. 여기에는 `FormBuilder`라는 특별한 Class가 있다.

먼저, 우리는 여기에 필요한 의존성을 import한 다음, `FormBuilder` instance의 도움을 받아 model과 future fields를 구성해야한다.



`client/imports/app/parties/parties-form.component.ts`
#### form model 생성하기

```typescript
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angualr/forms';

import template from './parties-form.component.html';

//...some line skipped...
  selector: 'parties-form',
  template
})
export class PartiesFormComponent implement OnInit {
  addForm: FormGroup;

  constructor(
    private: formBuilder: FormBuilder
  ){}

  ngOnInit(){
    this.addForm = this.formBuilder.group({
      name: [],
      description: [],
      location: []
    });
  }
}
```

> 이미 알고있듯이, `OnInit` interface를 사용했다. `ngOnInit` method를 호출한다. 이것은 ng2가 데이터 바인딩 된 input property를 초기화(init)한 후에, Directive/Component를 초기화한다. ng2는 interface가 있거나 없거나 ngOnInit을 찾고 호출한다. 그럼에도 불구하고 strong typing과  editor tooling을 원한다면 TypeScript를 directive class에 interface를 추가하는것이 좋다.



**`FormGroup`은 `FormControls`의 집합이다.**
또다른 방법으로는 이렇게 작성할 수 있다.

```typescript
this.addForm = new FormGroup({
  name: new FormControl()
});
```
provided된 첫 번째 값은 form controal의 초기 값이다. 다음은 이에대한 예시코드이다.

```typescript
this.addForm = this.formBuilder.group({
  name:['Bob']
});
```
name을 'Bob'으로 초기화할 것이다.

우리는 `addForm.value`를 model의 현재 상태(current state)값에 접근하기위해 사용할 수 있다.

```typescript
console.log(this.addForm.value);
> { name: '', description: '', location: '' }
```

또한 우리는 control value 각각에 독립적으로 접근할 수 있다.

```typescript
console.log(this.addForm.controls.name.value);
> ''
```

이제 template로 다시 돌아가보자. 우리는 다음 작업을 해야한다.
- `formGroup`을 bind
- `formControlName` directive를 우리의 inputs에 추가


#### 5.8 form directive를 구성하기(implement)

`client/imports/app/parties/parties-form.component.html`

```html
<form [formGroup]="addForm">
  <label>Name</label>
  <input type="text" formControlName="name">
  <label>description</label>
  <input type="text" formControlName="description">
  <label>location</label>
  <input type="text" formControlName="location">

  <button type="submit">Add</button>
</form>
```

`formGroup`에의해 우리는 `FormGroup`의 instance를 provide한다. 예제의 경우에 이것은 `addForm`이다.

`fromControlName` directives는 어떤가? 
- 보시다시피 우리는 `addForm` 구조와 일치하는 값을 사용하여 구현했다.
  - ex: ` <input type="text" formControlName="name">`
-  각 `formControlNam`은 model에 form element 값을 바인딩한다.

이제 사용자가 input안에서 타이핑할 때마다 `addForm` 및 해당 컨트롤의 값이 자동으로 업데이트 된다. 반대로, `addForm`이 HTML외부에서 변경되면 input value는 그에따라 업데이트된다.

#### 5.9 validators 추가하기

model에서 이름(name)과 위치(location)가 필수이므로, 여기에 유효성(validation)을 설정해보자. ng2에서는 필요한 컨트롤에 두 번째 매개변수로 `validation.required`라는 변수만 추가해주면 된다.


`client/imports/app/parties/parties-form.component.ts`

```typescript
//...
  ngOnInit(){
    this.addForm = this.formBuilder.group({
      name: ['', Validation.required],
      decription: [''],
      location: ['', Validation.required]
    });
  }
//...
```

우리는 다음 코드로 `addForm.valid` property가 결정되었을 때, valid한 값인지 체크해볼 수 있다.

```typescript
console.log(this.addForm.valid);
>false
```

## Event Handlers

### (ngSubmit)

우리는 앞 부분에서 form을 구성하고 form model과 동기화하는 작업을 했다. 지금부터는 Party collection에 새로운 party를 추가해보자. 

먼저 새로운 submit button과 submit event handler를 만든다.

이부분에서 ng2에서 멋진 기능 중 하나를 사용한다. 이 기능을 활용하면, **template에서 지역 변수를 정의하고 사용할 수 있다.** 예를들어, `template-driven-form`을 사용하는 경우, party를 추가하려면 form의 현재 상태를 가져와서 event handler로 전달해야한다. 우리는 form을 가져와서 template안에 이것을 print할 수 있다.

```typescript
`
<form #f="ngForm">
  //...
  \{{f.value}}
</form>
`
```
이런 화면을 볼 수 있을 것이다.

```
{name: '', description:'', location:''}
```

**우리는 분명히 form model object가 필요하다.**

`Model-driven-forms`를 사용하기로 결정한 이후로는 사용하지 않을 것이지만, 단순함과 강력함 때문에 언급할 가치는 있다고 생각한다.

튜토리얼로 다시 돌아가보자.

- submit event를 add button에 바인딩하자.
  - 이 이벤트는 버튼을 클릭하거나, 사용자가 최종 필드에서 enter를 누르면 trigger된다.

#### 5.10 ngSubmit 을 form에 추가하기

`client/imports/app/parties/parties-form.component.html`

```html
<form [formGroup]="addForm" (ngSubmit)="addParty()">
  <label>Name</Name>
  <input type="text" formControlName="name">

```


#### 5.11 addParty method 추가하기 

`client/imports/app/parties/parties-form.component.ts`

```typescript
import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Parties } from '../../../../both/collections/parties.collection';

import template from './parties-form.component.html';

@Component({
  //...some lines skipped...
  
})

export class PartiesFormComponent implement OnInit {
  //...some lines skipped ...
      location:['', Validation.required]
    });
  }

  addParty():void {
    if (this.addFrom.valid){
      Parties.insert(this.addForm.valud);
      this.addForm.reset();
    }
  }

}
```

> **Notice**: TypeScript는 어떤 컨트롤 속성을 사용할 수 있는지 알지 못하기 때문에 우리는 이를 대괄호 안에 넣어야한다.

이제 브라우저에서 화면을 확인해보자. input창에 텍스트를 추가하고 submit해보면 party가 추가되는 것을 확인할 수 있을 것이다.

## Types

지금의 코드를 조금 더 개선하고 싶다면, 우리는 TypeScript의 힘을 활용하고, 데이터베이스의 객체의 declare our types, model interface를 선언해야한다.

#### 5.14 CollectionObject model 생성하기

먼저 `_id` field가 포함된 데이터베이스 entties의 기본 model을 작성해보자


`both/models/colleciton-object.models.ts`
```typescript
export interface CollectionObject {
  _id?: string;
}
```

그리고 single `Party` object를 위한 model을 만들어보자.

#### 5.15 CollectionObject model을 extend하는 party model

`both/models/party.model.ts`

```typescript
import { CollectionObject } from './collection-object.model';

export interface Party extends CollectionObject {
  name: string;
  description: string;
  location: string;
}
```
이것은 우리가 나중에 UI의 collection 및 객체 type을 나타낼 때 사용한다.

> tadkim; 조금만 더 시간을내서 이 활용의 목적과 필요성, 방법에 대해서 이해+정리 해봐야겠다.


### (click)

#### 5.12 Add remove button

다음으로, 우리는 parties를 지우는(remove) 기능을 추가해볼 것이다.

`client/imports/app/app.component.html`

```html
      {{party.name}}
      <p>{{party.description}}</p>
      <p>{{party.location}}</p>
      <button (click)="removeParty(party)">X</button>
    </li>
  </ul>
</div>
```
여기서도 다시 class context에 event를 바인딩하고, parameter로 `party`를 전달한다. class 부분으로 이동하여, 이에대한 method를 추가해보자.

#### 5.13 removeParty method 구성(implement)하기

`client/imports/app/app.component.ts`

```typescript
//...
  constructor(){
    this.parties = Parties.find({}).zone();
  }

  removeParty(party:Party): void{
    Parties.remove(party._id);
  }
}
```

**Mongo Collection Parties**에는 `remove`라는 method가 있다.  해당 식별자(identifier) `_id`로 해당하는 party를 검색하고 삭제한다.

이제 브라우저에 보이는 parties 중 몇 개를 삭제해보자. **Meteor는 client간에 데이터를 동기화하므로, 다른 브라우저 client에서 (우리가 x버튼으로 삭제한) 데이터가 제거되는 것을 볼 수 있을 것이다.**



## Summary

이 챕터에서 우리는 다음과 같은 내용들을 다뤘다.

- ng2를 활용하여 form을 만들고 data에 접근(access)하는 것이 얼마나 쉬운지.
- meteor를 활용하여 data를 storage에 저장하는 것이 얼마나 쉬운지
- TypeScript에서 interface와 model을 어떻게 선언(delcare)하는지.



