# Bounce

Hit different.

## Overview

This app is currently a React/Next.js application using capacitor so it can run in any environment. Write once, run anywhere. The intent is that it can live like this forever, but if necessary, the mobile portion can be re-written in something like React Native or pure native applications.

## Philosophy for stack decisions

Optimize for:

1. Developer happiness
2. Developer productivity and ability to quickly iterate
3. Ability to provide an excellent UX
4. Ease of maintenance
5. Ease of onboarding new developers
6. Scalability
7. Minimize/eliminate vendor lock-in so it most seamlessly evolves

## Overview

- Use Tailwind almost exclusively for styling. Only use styled-components if tailwind isn't sufficient for something - ex. complex state-driven style, or animations.
- Make sure you download the Tailwind Intellisense extension for VSCode (offers suggestions and autocomplete). Hovering will show the CSS style applied. It also picks up on the config file for customizations.
- Extend the theme in the Tailwind config as needed to create reusable styles that are easy to change.
- Upgrade to pnpm once it can support prettier plugins - https://github.com/sveltejs/prettier-plugin-svelte/issues/155#issuecomment-791935741
- If you're using the Poppins front, make sure to use `src/components/utilities/PoppinsFont`. This is included at the page level to ensure unnecessary files aren't loaded as it's used sparingly

## Set up for success

- Recommend VS Code
- Prettier plugin for auto-formatting of code
- Tailwind plugin for auto-completion of Tailwind classes

## Deployment

Vercel - https://vercel.com/bouncehq

## Run Web

Install

```
yarn
```

Run web

```
yarn dev
```

Authorization is done in the `function` folder using Firebase. Firebase is used as minimally as possible and only meant to handle auth and inserting the initial user into our database.

## Run iOS Local

```
yarn export && npx cap run ios
```

## Debugging

**iOS**

- console.log can be viewed in the Safari debugger: Develop > select environment and then select emulator

## Improvements

- Live reload for mobile development
- User `react-form-hook` or similar package to manage forms
- Stricter password requirements or keep a lower threshold for ease of use?
- When I pass the token to our internal API, I should probably do it in the header instead of a payload, and should probably do it automatically in the API itself (or some kind of middleware on the client)

## Scripts

- App and splash icons are generated using `cordova-res` (https://stackoverflow.com/questions/71611839/how-to-change-icon-and-splash-screen-in-ionic-6)
- ^^^ I used Android studio to generate some of them - https://developer.android.com/studio/write/image-asset-studio

## TODO

- How to handle charge disputes?
- Migrations happen through local Hasura
- When Hasura is updated, make sure you run the codegen on web and firebase
- For styles, instead of baking them into compnents, they are simply CSS combo classes. Component libraries that are done incorrectly can be very brittle and source of tech debt. With design changing rapidly, it makes more sense to do it as light weight as possible.
- Our design uses a lot of children that scroll between fixed elements on the top and bottom that can be dynamic height. In mobile browsers, the 100vh doesn't work because they all account for the browser input bar differently. -webkit-fill-available isn't complete and was tried in a few places. This works decent for screens that purely need to be 100vh but not scroll. However, for screens that do need 100vh with scrollable children, it doesn't work universally cross browser and device. One solution is to used fixed position elements at the top and bottom, but these could be dynamic height, so it would be difficult to handle those without fixing elements dimensions and offset them correct (for example, like we can do with the bottom nav tabs). I think that is ideal if the design settles and we can be confident on dimensions. However, this can be brittle. If not possible, there are other solutions for mobile, like fixing the height to the pixel height - https://dev.to/maciejtrzcinski/100vh-problem-with-ios-safari-3ge9,https://dev.to/admitkard/mobile-issue-with-100vh-height-100-100vh-3-solutions-3nae

Do I need to register firebase inside app?

```swift
import SwiftUI
import FirebaseCore


class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()

    return true
  }
}

@main
struct YourApp: App {
  // register app delegate for Firebase setup
  @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate


  var body: some Scene {
    WindowGroup {
      NavigationView {
        ContentView()
      }
    }
  }
}
```

This looks fixed (Nov 6, 2022) for building with multiple envs. iOS is handled through Xcode and env vars

```
// TODO: Should we build with different app IDs and names so they can have two versions installed at the same time?
// cap sync would need to specify environments
// "export:staging": "cp ./.env.development ./.env.local && next build && next export && NODE_ENV=development npx cap sync",
// "export:production": "cp ./.env.production ./.env.local && next build && next export && NODE_ENV=production npx cap sync",
//
// const configStaging: CapacitorConfig = {
//   appId: 'game.bounce.app-staging',
//   appName: 'Bounce Staging',
//   webDir: 'out',
//   bundledWebRuntime: false,
//   server: { hostname: 'localhost:3000', iosScheme: 'https', androidScheme: 'https' },
// };
//
// const environmentConfig = process.env.NODE_ENV === 'production' ? config : configStaging;
//
// export default environmentConfig;

```

## Software Design decision notes

- We use Next.js API routes for business logic and things that must be done on the server - ex. payments, adding to lesson, other things that must do complex checks. Hasura is used for permissioned access to the database and the primary way we CRUD. This makes the UI a bit more complex instead of doing all logic on the server. If we want to not mix REST and GraphQL, we can create a new server or use an API route with GraphQL and stitch it in to Hasura.
- Early on this follows a WET principle (Write Everything Twice). We're moving fast and still testing design and product-market fit. Once patterns and screens emerge and we understand the correct abstractions, we should componetize UI and modularize functionality. This believes that no abstraction is better than laying the foundation of the code on the wrong abstraction.
- For the user_follows table (table of followers/following), I debated between a UUID `id` column and a composite key of the `follower_user_id` and the `followed_user_id`. While I think this would be suitable, I know there can be cases where composite keys break down, can make queries complex, can make it hard to relate tables, or make data aggregation too complex. Many GraphQL tools also expect an ID field. Using a PK id and unique key that's a composite seemed like the easiest solution and one that can be changed with the least effort later on if needed. In the Apollo client, I treat the `follower_user_id` and `followed_user_id` as the keyFields, so ensure you always query for both of these fields.
- 2022-09-05 - the `styles/elements` is probably not the right pattern. It should likely just be global CSS classes that apply tailwind
- Notification thought pricess: A primary entity `user_notification_entities` takes and action which creates the `user_notification_details` which is 1-to-1, and many users can receive this notification in `user_notifications`. entity -> action -> receivers
- Notifications - To keep the content of the notification rich, the complexity low, and the transparency high, I am creating foreign key associations to the tables that are referenced. A more robust but complex way to approach would be create templates for the payload received in a notification along with a type and version that we could could expand generically and evolve. So the data would be defined, and the UI component would know which version to use based on the data defined for that type, version, and payload. If breaking changes were introduced to the data expectations, it could evolve to a new component. This seems like overkill for now and can be implemented later if needed. I am calling a `notification` specifically something that is listed in the application's activity feed. Messages that are sent to a user we'll use the terminology of `communication`. While notifications and communitications can be linked, this will allow us to create the appropriate separation when some event should only be sent to either location exclusively.
- `user_notification_details` encapsulates the information about the action taken. The `user_notifications` points to details and is all the users that received this notification. The `user_notification_entities` is the data associated with the notification. This can be evolved further to account for data that changes over time and thus create new fields like an FK that points to parent entities or a notification detail could have many additional entities (so an FK 1-to-many relation from detail-to-many entities). These are intentionally left off for now until we have a better understanding of the system and experience in the application, and intentionally left simple until needed to be more complex.
- We're considering many "product" types and ways to utilize them. This makes complex transactions/orders. Ex. lessons, lesson bundles/vouchers (ability to claim a spot in future lessons by paying up front), buying multiple slots/quantity in a single lesson, player subscriptions, coach subscriptions, enterprise club subscriptions, court booking fees, league fees, merchandise from us, and perhaps even merchandise from clubs or coaches. On top of that, coaches have mentioned the possibility of splitting earnings from lessons/clinics/camps. Part of these "products" are defined by the users, and the other part is defined by us. The risk is making some way too overly complex that may never be needed or don't have the data yet to handle all these stakeholders and options correctly. After much thought and deliberation, I decided the situation I would most prefer to walk into would be one with the most simple and straightforward implementation that I could then evolve as needed, as opposed to coming into a situation with an incredibly complex and confusing system that was built with zero user data. Currently the UI/UX is geared to a single transaction to reserves a spot in a single lesson - I built towards this with the idea that bundles could be added later or the ability to purchase multiple slots, so there could be new item added for bundle that entitles you to vouchers or purchasing multiple quantity of slots in a single lesson where we would just add another column or list to indicate the # of slots purchased-slots released (releases can be through either refunded or non-refunded cancels). A lesson participant could own multiple slots that are tied to a transaction line item or voucher redemption (purchasd previously as a bundle). Thinking stream of conscious, there could be a many-to-one table where it tracks lesson slots which are claimed through a direct purchase or voucher, and deducted by spots released through cancels (whether refunded or non-refunded). This should be easy to add later.
- Added the package `react-if` late. It seems like a good pattern for conditional rendering and should start to be integrated. But it also makes our components larger. Perhaps the solution to the problem is just writing small, simple components that do there job and focus on best practices? We're also moving away from built-in JS that does the same thing. Ex. comment - "I think splitting up and using composition would be a far simpler approach. Complex components with multiple conditions in it should simply not exist, we should separate by concerns." Is it just poluting UI logic with component logic?

For the decisions that are intentionally narrow, I've also chosen target names in the database so that if things are generalized, the preferred names could be avaialble, and we can just insert into that table if we switch over. Ex. `user_notifications` instead of `notifications`. If we have a more robust notification system or want want to introduce other notifications like for clubs, we have options, and things are currently named in a targeted manner.

## Web Process

Building a page/route and general patterns used:

1. Create a file pages for a new route/page
2. Create a screens which holds the page content
3. Build resuable components in components
4. Add theme variables to tailwind.config.js when needed
5. Create compound classes like buttons in globals.css src/styles/globals.css
6. Favor React hooks and functional components. There likely shouldn't be any class components.
7. Always use TypeScript. If the page uses data, make sure you use the automatically generated types from src/types/generated
8. Favor statically generated pages when it makes sense for speed
9. Files live where they're used. For example, tests live next to files that they're testing, and GraphQL queries live next to page where the query is called (unless called in multiple places)

Open questions:

1. Should we use Next app folder once it is suitable for production?
2. Should we use react-query for REST API requests?

APIs:
This is still being discussed. Previously some logic lived in Python and some logic lived in Next.js. I believe the plan will be to send all API requests to the Next API so all data flows through there and then call other APIs from that layer when needed.

Next.js API routes

- For authentication in the Next.js, use the middleware that wraps the route handler
- Next/Vercel introduced Edge routes. These use a V8 engine instead of Node. They claim that it doesn't suffer from the same cold start issue and serverless functions, so it should perform faster. We should test this claim, but it seems to make sense to use these when possible. https://vercel.com/docs/concepts/functions/edge-functions
  - ^ Still figuring out the best patterns for edge routes

Styling:

- Use tailwind as much as possible
- Put things in the tailwind theme, so if something needs to be changed (for example a color), it only has to be done in one place.
- We still have styled-components as dependency, but it’s used very infrequently. I keep it around for styles that are driven off of complex state that is better off abstracted, but I find myself mostly reaching for the classNames helper util combined with tailwind instead of styled-components,

Folder Structure:
src/components - Reusable components
src/context - Store React context (global state)
src/gql - GraphQL queries that are used in multiple places in the app
src/hooks - Reusable custom hooks
src/layouts - Abstraction for page layouts/templates
src/pages - This is a Next.js standard that defines routes based on the folder structure
src/screens - Imported into src/pages. These wrap the actual content of page
src/services - Communicate with something external
src/styles - Abstractions for styles
src/types - TypeScript files
src/utils - Reusable functionality for within the application (should this be broken apart further? It can get dense.)
functions - Firebase functions (primarily used for signup)

---

Force deploy: 2024-02-28#1
