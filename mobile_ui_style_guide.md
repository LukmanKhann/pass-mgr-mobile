# UI Style Guide

---

## General

- **File length limit**: 400 lines of code (LOC)
- **Function length limit**: 20 LOC
- **Column limit**: 120 symbols
- **Indentation**: Space only (1 tab === 2 spaces)
- Use only **functional components**. Class components are forbidden.
- Always use **JSX syntax**
- Prefer `const` for variable declarations. Use `let` only if truly necessary.
- Strive to split code into small pure functions and minimize mutations.
- Always use **typings** for method parameters and return values.
- **Unused (dead) code is not allowed.**
- `console.log` in develop branch is not allowed.
- **No separate style files** — always use **inline/in-file styling** if styling is needed. Do not create `.style.ts` or any dedicated style files.

---

## Architecture

Simple modular architecture with **one-way data flow**. Bottom layers strictly cannot use top layers.

| Layer          | Description                                                                                                          | Can Use                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **Views**      | Components related to a specific page (AuditLog, UserManagement, UnifiedDashboard, etc.)                             | Modules, Widgets, Components |
| **Modules**    | Standalone components with own services, types, enums, and child components (Escalations, Notifications, Chat, etc.) | Widgets, Components          |
| **Widgets**    | Simple reusable business-related components (ClientCard, ServiceChip, DashboardWidget, etc.)                         | Components only              |
| **Components** | Simple reusable UI components (button, input, tooltip, modal, spinner, etc.)                                         | Nothing above                |

---

## Formatting

Imports are grouped and sorted with ESLint plugin `eslint-plugin-simple-import-sort`. This plugin runs automatically via `eslint --fix`.

All imports are divided into **3 groups** with an empty line between each group, in this order:

1. React related imports
2. 3rd party imports
3. Local imports

Within each group, imports are sorted **alphabetically** by the `from` string.

### ESLint Import Sorting Configuration

```js
'simple-import-sort/imports': ['warn', {
  groups: [
    ['^react'],
    ['^?\\w'],
    [
      '^(src|.|..)/.*.component$',
      '^(src|.|..)/.*.service$',
      '^(src|.|..)/.*.hook$',
      '^(src|.|..)/.*.type$',
      '^(src|.|..)/.*.enum$',
      '^(src|.|..)/.*.util$',
      '^(src|.|..)/.*.constant$',
      '^(src|.|..)/.*.slice$',
      '^(src|.|..)/.*.selector$',
      '^(src|.|..)/.*.guard$',
      '^(src|.|..)/.*.style$',
      '^(?!\\u0000)(src|.|..)/.*',
      '^.$',
      '^\\u0000',
    ],
  ],
}]
```

---

## Naming

| Item                      | Convention                         | Example                                                                                                   |
| ------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Folder name               | dash-case                          | `foo-bar`                                                                                                 |
| File name                 | kebab-case with suffix             | `foo-bar.component.tsx`                                                                                   |
| File suffix               | Always use type suffix             | `.component`, `.service`, `.constant`, `.enum`, `.type`, `.hook`, `.util`, `.reducer`, `.slice`, `.guard` |
| React components          | `.tsx` extension                   | `MetricCard.tsx` → `metric-card.component.tsx`                                                            |
| Root components           | `index.tsx`, named after directory | —                                                                                                         |
| Hook files                | Start with `use-`                  | `use-user.hook.ts`                                                                                        |
| Interfaces                | Must start with capital `I`        | `IUser`, `IDoctor`, `ILayer`                                                                              |
| Types                     | Must start with capital `I`        | `IProduct`, `IResponse`, `IConfig`                                                                        |
| Enums                     | End with `Enum`                    | `EntityEnum`                                                                                              |
| Component props interface | Always `IProps`                    | —                                                                                                         |
| Prop names                | camelCase                          | —                                                                                                         |
| Internal methods          | No underscore prefix               | —                                                                                                         |

### Interface & Type Naming

Both `interface` and `type` declarations **must** be prefixed with a capital `I`. No exceptions.

```ts
// bad
interface User { ... }
interface Doctor { ... }
type Product = { ... }
type ApiResponse = { ... }

// good
interface IUser { ... }
interface IDoctor { ... }
interface ILayer { ... }
type IProduct = { ... }
type IApiResponse = { ... }
type IConfig = { ... }
```

This rule applies everywhere — props, service types, API models, utility types, everything.

---

## Folder Structure

Only `index`, `service`, and `type` files are allowed in the root of a module.

Files of the same type (constants, enums, hooks, styles, utils, etc.) should be placed in their corresponding subfolder — **unless there is only one file of that type**, in which case it may live in the module root.

### Module Structure Example

```
├─ service-module
│  ├─ dashboard
│  │  ├─ components
│  │  ├─ utils
│  │  ├─ dashboard.enum.ts
│  │  ├─ dashboard.constant.ts
│  │  ├─ dashboard.hook.ts
│  │  ├─ dashboard.style.ts
│  │  ├─ dashboard.service.ts
│  │  ├─ dashboard.type.ts
│  │  └─ index.tsx
│  ├─ entities
│  │  ├─ components
│  │  ├─ constants
│  │  │  ├─ entities1.constant.ts
│  │  │  ├─ entities2.constant.ts
│  │  │  └─ entities3.constant.ts
│  │  ├─ entities.service.ts
│  │  ├─ entities.type.ts
│  │  └─ index.tsx
│  └─ section3
│     ├─ subfolder1
│     ├─ subfolder2
│     │  ├─ components
│     │  ├─ subfolder2.service.ts
│     │  └─ subfolder2.type.ts
│     ├─ components
│     ├─ section3.service.ts
│     ├─ section3.type.ts
│     └─ index.tsx
```

### Shared Folder Structure Example

```
├─ shared-folder
│  ├─ subfolder1
│  │  ├─ subfolder1.enum.ts
│  │  ├─ subfolder1.constant.ts
│  │  ├─ subfolder1.style.ts
│  │  └─ subfolder1.component.ts
│  └─ subfolder2
```

---

## Ordering

### Components

1. Constants
2. Custom hooks
3. React hooks (`useState` and `useEffect` go first)
4. Functions
5. Return statement

### Services

1. Public variables
2. Private variables
3. Public methods
4. Private methods

### Example

```tsx
// good
export default function MetricCard({ value }: IProps): JSX.Element {
  const type = 'test';
  const score = 0;

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [details, setDetails] = useState<IDetails>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    // ...
  }, []);

  const handleCallback = useCallback(() => {
    // ...
  }, []);

  const getDetails = (): void => {
    // ...
  };

  return (
    // ...
  );
}
```

---

## Code

### Object Shorthand

```ts
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = { lukeSkywalker: lukeSkywalker };

// good
const obj = { lukeSkywalker };
```

### Object Destructuring

```ts
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;
  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

### Array Destructuring

```ts
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

### Arrow Functions

Use arrow function notation for anonymous/inline callbacks:

```ts
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map(x => {
  const y = x + 1;
  return x * y;
});
```

If the function body is a single expression, omit braces and use implicit return:

```ts
// bad
[1, 2, 3].map(number => {
  `A string containing the ${number}.`;
});

// good
[1, 2, 3].map(number => `A string containing the ${number}.`);

// good (multi-line)
[1, 2, 3].map(number => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});
```

### Template Strings

```ts
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

### Default Parameters

Always put default parameters last:

```ts
// bad
function handleThings(opts = {}, name) {}

// good
function handleThings(name, opts = {}) {}
```

### No Parameter Reassignment

Never reassign parameters — it can cause unexpected behavior and V8 optimization issues:

```ts
// bad
function f1(a) {
  a = 1;
}

// bad
function f2(a) {
  if (!a) {
    a = 1;
  }
}

// good
function f3(a) {
  const b = a || 1;
}

// good
function f4(a = 1) {}
```

### Avoid Unneeded Ternaries

```ts
// bad
const foo = a ? a : b;
const bar = c ? true : false;
const baz = c ? false : true;

// good
const foo = a || b;
const bar = !!c;
const baz = !c;
```

### No Iterators

Prefer higher-order functions over `for-in` / `for-of` loops. This enforces immutability and pure functions.

Use: `map()`, `every()`, `filter()`, `find()`, `findIndex()`, `reduce()`, `some()` for arrays.
Use: `Object.keys()`, `Object.values()`, `Object.entries()` for objects.

---

## Testing

We use **Jest** and **React Testing Library** for unit and integration tests.

### Testing Scripts

- `test` — run tests without coverage (used for pre-push hook; only runs tests for files modified relative to `origin/develop`)
- `test-coverage` — run tests and collect coverage (saved locally, viewable at `coverage/lcov-report/index.html`)

All tests are automatically executed by Jenkins daily. Coverage is viewable on the SonarQube project overview.

**Target coverage thresholds: 80%** for all four criteria — statements, branches, functions, and lines.

---

### File Structure

All test files must be created inside a `__test__` folder at the same level as the file being tested. Mocks should also live in the same `__test__` folder.

```
├─ __test__
│  ├─ entity1.service.test.ts
│  ├─ entity1.mock.ts
│  └─ entity2.component.test.tsx
```

---

### Naming Convention

- Root `describe` must match the name of the component/page/hook/util being tested.
- Nested `describe` blocks group test cases. If grouping by condition/state, start with `"when"`.
- `it` descriptions must start with `"should"`.
- If testing a specific method, start with the method name after `#`.

```ts
describe('useAuth', () => {
  it('should throw context error', () => { ... });

  it('#toggleLoading - should toggle loading state', () => { ... });

  describe('when user does not exist', () => {
    it('should return guest user', () => { ... });
    it('should destroy session on window close', () => { ... });
  });
});
```

---

### Code Formatting (AAA Pattern)

Break each test into **Arrange**, **Act**, **Assert**:

```ts
it('should return sum of two numbers', () => {
  // Arrange
  const a = 10;
  const b = 3;

  // Act
  const c = add(a, b);

  // Assert
  expect(c).toBe(13);
});
```

If a mock is a complicated object or array, move it to a `.mock.ts` file:

```ts
// bad — inline mock with 20+ lines
it('should check if is specific user', () => {
  const mockUser = { /* 20+ lines */ };
});

// good
import { mockUser } from './user.mock.ts';
it('should check if user is available', () => { ... });
```

---

### What and How to Test

- **Do not test your mock implementation.** Mocks support the test; they are not the target.

```ts
// bad
const spy = jest.spyOn(ClientService, 'getClientId');
spy.mockImplementation = () => '1234';
expect(ClientService.getClientId()).toBe('1234');

// good
expect(screen.getByRole('textbox', { name: 'clientId' })).toHaveValue('1234');
```

- **Isolate your tests.** Mock all unrelated dependencies, including the Redux store and all API calls.

```ts
jest.spyOn(apiService, 'get').mockResolvedValue({ data: response });
const store = TestingUtil.setupStore(state);
return render(<Provider store={store}>{/* components */}</Provider>);
```

- **Don't test 3rd-party libraries.**
- **Follow the user.** Trigger interactions via rendered markup; validate markup changes.
- Write clean unit tests only when testing complex isolated logic provides real future value.
- **Avoid "is rendering" tests.** Focus on valuable behavioral tests instead.
- **Do not destructure render result.** Use the `screen` object for queries.
- Follow the **recommended query priority order** from React Testing Library.
- **Test execution time must not exceed 2 seconds.** Optimize or rethink if it does.

---

### Useful Practical Cases

**Repeated rendering:**

```ts
beforeEach(() => {
  render(<YourComponent />);
});

// Or with variable props:
const renderComponent = (params): void => {
  render(<YourComponent {...params} />);
};
```

**Testing user events:**

Use `userEvent` (not `fireEvent`). Call `userEvent.setup()` before rendering:

```ts
it('should increase counter when user clicks INCREASE button', () => {
  const user = userEvent.setup();
  renderComponent();
  user.click(getByText('Increase'));
  // assertions...
});
```

**Wrapping in `act`:**

If you get `"code that causes React state updates should be wrapped into act(...)"`, use `waitFor`:

```ts
it('should fetch person name', async () => {
  const user = userEvent.setup();
  render(<YourComponent />);
  user.click(getByText('Fetch'));

  await waitFor(() => {
    expect(getByText('David')).toBeInTheDocument();
  });
});
```

---

## Rule Sources

- [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/)
- [Airbnb React/JSX Style Guide](https://airbnb.io/javascript/react/)

---

## Styling

### Always Use StyleSheet

**Never use inline style objects** — always define styles using `StyleSheet.create()` within the component file. Do not create separate `.style.ts` files; the `StyleSheet` block lives at the bottom of the same `.component.tsx` file it belongs to.

```tsx
// bad — inline style object
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ fontSize: 14, color: '#333' }}>Hello</Text>
</View>;

// bad — separate style file (style.ts / component.style.ts)
import { styles } from './my-component.style.ts';

// good — StyleSheet.create at the bottom of the component file
import { StyleSheet, View, Text } from 'react-native';

export default function MyComponent(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
});
```

Dynamic styles that depend on props or state should be computed inline via a helper function or a plain object merge, keeping the base definitions in `StyleSheet.create()`:

```tsx
// good — base in StyleSheet, dynamic part merged inline
const styles = StyleSheet.create({
  chip: {
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});

<View style={[styles.chip, { backgroundColor: color }]} />;
```

---

## Code Reuse & Global Shared Code

### Always Prefer Existing Global Components

Before writing any new UI element or utility, check whether a shared/global equivalent already exists. Duplicate implementations of buttons, cards, typography, icons, modals, or utility functions are **not allowed**.

- Reuse components from the `components/` layer (button, input, modal, spinner, typography, icons, widgets, etc.).
- Reuse hooks, utilities, constants, types, and services from the `global/` folder.
- If a global component almost fits but needs a small variation, **extend or compose** it rather than copying it.

```tsx
// bad — reimplementing a button that already exists globally
<TouchableOpacity style={styles.btn} onPress={onPress}>
  <Text style={styles.btnText}>Submit</Text>
</TouchableOpacity>;

// good — use the existing global Button component
import Button from '../../../../components/button.component';

<Button onPress={onPress} label="Submit" />;
```

### Global Folder for Shared Code

Any constant, type, interface, hook, service, or utility that is used by more than one module **must** live in the global shared folder, not inside a specific module. This prevents duplication and keeps shared logic in a single source of truth.

```
// bad — type defined inside a specific module used elsewhere
src/modules/notifications/types/notification.type.ts  ← used by 3 modules

// good — shared type lives in the global folder
src/global/types/notification.type.ts
```

Global folder conventions:

| Artifact   | Location                             |
| ---------- | ------------------------------------ |
| Types      | `src/global/types/*.type.ts`         |
| Interfaces | `src/global/types/*.type.ts`         |
| Enums      | `src/global/enums/*.enum.ts`         |
| Constants  | `src/global/constants/*.constant.ts` |
| Hooks      | `src/global/hooks/use-*.hook.ts`     |
| Services   | `src/global/services/*.service.ts`   |
| Utils      | `src/global/utils/*.util.ts`         |

---

## Import Order (React Native)

All imports are divided into **3 groups** separated by a blank line, in this exact order:

### Group 1 — React, React Native & Third-Party Packages

`react`, `react-native`, and all external npm packages together in one group.

```tsx
import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
```

### Group 2 — Local Default Imports (no curly braces)

All local project imports that use a **default import** — components, hooks, utils, services, etc. — with no curly braces. Sorted alphabetically by path.

```tsx
import Card from '../../../../components/card.component';
import Body from '../../../../components/typography/body';
import Title from '../../../../components/typography/title';
import DateTimeWidget from '../../../../components/widget/date-time-widget';
import Ellipse from '../../../../components/widget/ellipse';
import MaterialSymbols from '../../../../components/icons/material-symbols';
import PriorityLabel from '../../../../components/widget/priority-label';
import StringUtil from '../../../../Core/util/StringUtil';
import renderPriority from '../../../../utils/render-priority.utils';
```

### Group 3 — Local Named Imports (curly braces)

All local project imports that use **named exports** `{ }` — types, interfaces, enums, constants, context, utils, etc. Within this group, lines with fewer named exports come before lines with more:

- Single named import `{ One }` — comes first, sorted alphabetically by path.
- Multiple named imports `{ A, B }` — comes last, sorted alphabetically by path.

```tsx
import { ThemeContext } from '../../../../themes/theme-context';
import { getStatusFilled } from '../../../../utils/common-color-palette';
import { IServiceListProps } from '../types/service-list.types';
import {
  dateTimeFormat,
  DateTimeService,
} from '../../../../services/date-time.service';
```

### Full Example

```tsx
// Group 1 — React, React Native & third-party packages
import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

// Group 2 — local default imports (no curly braces)
import Card from '../../../../components/card.component';
import Body from '../../../../components/typography/body';
import Title from '../../../../components/typography/title';
import DateTimeWidget from '../../../../components/widget/date-time-widget';
import Ellipse from '../../../../components/widget/ellipse';
import MaterialSymbols from '../../../../components/icons/material-symbols';
import PriorityLabel from '../../../../components/widget/priority-label';
import StringUtil from '../../../../Core/util/StringUtil';
import renderPriority from '../../../../utils/render-priority.utils';

// Group 3 — local named imports (curly braces), fewer exports first
import { ThemeContext } from '../../../../themes/theme-context';
import { getStatusFilled } from '../../../../utils/common-color-palette';
import { IServiceListProps } from '../types/service-list.types';
import {
  dateTimeFormat,
  DateTimeService,
} from '../../../../services/date-time.service';
```

### Summary Rules

| Rule                 | Detail                                                                                |
| -------------------- | ------------------------------------------------------------------------------------- |
| Group 1              | `react`, `react-native`, and all third-party npm packages                             |
| Group 2              | Local default imports only (no curly braces)                                          |
| Group 3              | Local named imports only (curly braces); fewer exports per line → fewer exports first |
| Blank lines          | One blank line between each group; no blank lines within a group                      |
| Sorting within group | Alphabetically by `from` path                                                         |
