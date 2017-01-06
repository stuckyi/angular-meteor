#  [angualr-meteor] 3. Dynamic-template

이제 Angular2를 이용하여 웹페이지를 다이나믹하게 만들어 볼 시간이다.

이 단계는 여전히 클라이언드 측 Angularjs 도구에 초점을 맞출 것이다. 다음은 meteor의 전체 stack 파워를 얻는 방법을 보여준다.

## Data in the view

- Angular에서 view는 HTML 템플릿을 통해 모델을 투영한 것이다.
- 즉, 모델이 변경 될 때 마다 Angular는 view를 업데이트하는 적절한 바인딩 포인트를 새로 고친다.

우리의 템플릿을 동적으로 변경해보도록 하자.

_client/imports/app/app.component.html_
```
<div>
  <ul>
    <li *ngFor="let party of parties">
      {{party.name}}
      <p>{{party.description}}</p>
      <p>{{party.location}}</p>
    </li>
  </ul>
</div>
```

angular에서 `*ngFor`나 `ngIf`, `ngClass` form directive 등은 component template에서 global하게 사용할 수 있다.



## Component Data

- 이제 우리는 초기 데이터 모델을 생성하여 view에서 렌더링 할 것이다.
- 이 코드는 `AppComponent` 클래스 생성자 안에 있다. 생성자는 클래스가 로드될 때 실행되는 함수이므로 클래스의 초기 데이터를 로드한다.


_client/imports/app/app.component.ts_

```typescript
        selector: 'app',
        template
})
export class AppComponent {
        parties: any[];

        constructor() {
                this.parties = [
                        {'name': 'Dubstep-Free Zone',
                                'description': 'Can we please just for an evening not listen to dubstep.',
                                'location': 'Palo Alto'
                        },
                        {'name': 'All dubstep all the time',
                                'description': 'Get it on!',
                                'location': 'Palo Alto'
                        },
                        {'name': 'Savage lounging',
                                'description': 'Leisure suit required. And only fiercest manners.',
                                'location': 'San Francisco'
                        }
                ]
        }
}

```

이쯤에서 한번 더 meteor를 실행해보자.

```
meteor
```

- 아마 data model인 parties가 `AppComponent`내에서 인스턴스화 된 것을 볼 수 있을 것이다.
        - **인스턴스화**
- `parties: any[]`에서 우리는 TypeScript에게 이 변수가 배열임을 알려준다.


#  Summary

- 전체 Component가 포함된 동적 앱(Dynamic Application)이 생겼다.
- 하지만 여전히 이것은 모든 것이 클라이언트 측면에 대한 코드이다.
- 자습하기에는 좋지만, 실제 application에서는 서버에 데이터를 유지하고, 모든 클라이언트를 동기화해봐야한다.
- 3 단계에서 meteor의 강력한 힘을 app에 적용하는 방법을 학습해보자.




