# Feature: Localization of user interface elements

The user scenarios on this page are examples of "specification by example". They are described in [Gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin) syntax.

The scenarios can be summarized by a single rule: "serve the user-preferred version if it exists, else the English version if it exists, otherwise the German version, which is guaranteed to exist". This is indeed how the localization is implemented in the production code. However, this rule cannot be used for automated testing. 

The automated test in JavaScript that corresponds to the user scenarios is [here](../test/services_transl8_spec.js). The production code is tested against this specification.


## Scenario: English-speaking user

```gherkin
Given a user has chosen "en" as their primary browser language.
When the user opens the landing page.
Then the "navbar_about"-Item is entitled "About Arachne".
```

## Scenario: German-speaking user

```gherkin
Given a user has chosen "de" as their primary browser language.
When the user opens the landing page.
Then the "navbar_about"-item is entitled "Über Arachne".
```

## Scenario: Danish-speaking user

```gherkin
Given a user has chosen "da"  as their primary browser language.
When  the user opens the landing page.
Then  the "navbar_about"-item is entitled "About Arachne".
```

## Scenario: missing translation (Englis-speaking user)

```gherkin
Given a user has chosen "en"  as their primary browser language.
 And the "navbar_about"-item lacks an English translation
When the user opens the landing page.
Then the "navbar_about"-item is entitled "TRL8_MISSING".
```

## Scenario: missing translation (Danish-speaking user)

```gherkin
Given a user has chosen "da"  as their primary browser language.
 And the "navbar_about"-item lacks an English translation
When the user opens the landing page.
Then the "navbar_about"-item is entitled "TRL8_MISSING".
```

## Scenario: missing translation (German-speaking user)

```gherkin
Given a user has chosen "de"  as their primary browser language.
 And the "navbar_about"-item lacks an German translation
 When the user opens the landing page.
 Then the "navbar_about"-item is entitled "TRL8_MISSING".
```