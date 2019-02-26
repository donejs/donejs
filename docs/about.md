@page About
@parent DoneJS
@hide sidebar
@outline 2 ol

@description

<img src="https://www.bitovi.com/hubfs/Imported_Blog_Media/donejs-logo-ie.png"/>

DoneJS' goal is to help the JavaScript community get amazing applications done fast.
Amazing applications are fast, sublimely usable, and maintainable.

But times change and new techniques emerge. We strive to adopt these
techniques, improve the stack, and provide a simple upgrade path along the way.

We are part of a community that helps developers of all skill levels and
backgrounds learn the technology, excel at it, and accomplish their
goals.

Learn about the goals, history, roadmap, and team behind DoneJS.

@body

## Goals



DoneJS has three primary goals:

1.  To enable developers to easily create high performance, maintainable, highly usable (amazing) applications.
2.  To continually evolve with new techniques and tools.
3.  To support the technology community.

### Amazing Applications

Building a modern application is increasingly difficult. Your app
needs to look good and run fast on every
platform and browser.  And, you need to get your app done yesterday.
Not kinda done.  Done done.

Helping you get a high performance, sublimely usable, and maintainable application
done fast is DoneJS's primary goal. This is why our logo
is a browser that looks like a checkered flag. We're committed
to your release.

We aim to help in three main ways:

#### 1. Solving difficult technical problems

DoneJS has good solutions for:

 - [Building mobile and desktop applications](./Features.html#ios-android-and-desktop-builds)
 - [Server Side Rendering](./Features.html#server-side-rendered)
 - [Automatic real-time updates](./Features.html#real-time-connected)
 - [Fast download times](./Features.html#progressive-loading)

These are just a few examples from our [features page](./Features.html). If
there's a hard problem that you keep running into, we want to solve it.

#### 2. Providing an integrated solution

Too many choices can make decision making difficult.  DoneJS simplifies
matters by providing a full stack of frontend tooling tested to work
great together.  The start of the [features page](./Features.html)
goes into detail with examples of this benefit.

_Note: Despite being an integrated solution, you can replace parts of
DoneJS with alternatives._


#### 3. Doing the right thing

Writing tests and documentation, setting up continuous integration and deployment
isn't fun or easy.  DoneJS tries to lower the barrier enough to
making doing the _right thing_ simply part of the normal development cycle.

Check out what DoneJS does for:

- [Tests](./Features.html#comprehensive-testing)
- [Documentation](./Features.html#documentation)
- [Continuous Integration and Deployment](./Features.html#continuous-integration--deployment)
- [Modlets](./Features.html#modlets)
- [Generators](./Features.html#generators)

### Evolve

Application development and maintenance often
lasts many years. Stability is needed to release complex applications. However,
new techniques and best practices are constantly evolving.

DoneJS's goal is to strike a balance between immovable stability and irresistible progress. We do this by evolving frequently, while maintaining backward compatibility between major releases.

It can be a bumpy road, with lots of little changes. But it
avoids rewrites, resulting in greater productivity:  

<img src="https://www.bitovi.com/hubfs/Imported_Blog_Media/mountain-climb1.jpg"/>


DoneJS is the successor to JavaScriptMVC. If your project chose JavaScriptMVC in 2007, you would have made a wise decision, giving your team an upgrade path to a modern application for the past 10 years.

We hope to continue this trend until programs start writing themselves.

### Community

Software is better with friends.  Our goal is to establish a world-wide
community with people of all backgrounds and skill levels dedicated to
teaching, exploring, and innovating.

#### Teaching

Technology is worth nothing if people don't know how to use it. We want
to create great learning material, but also create an environment
where people feel comfortable getting help.  

The core team is always available on [Slack](https://www.bitovi.com/community/slack) ([#donejs channel](https://bitovi-community.slack.com/messages/CFC80DU5B))
and provides [weekly training](https://www.bitovi.com/blog/free-weekly-online-javascript-training). Signup for a [meetup](./community.html) and we will come to your
city and teach you DoneJS!


#### Exploring

DoneJS has benefited greatly from other projects ideas and technology. It should continue to enhance other communities.  

You can already use many of DoneJS parts with other projects:

 - StealJS works great with ReactJS.
 - CanJS works with RequireJS or Browserify.
 - can-connect works on its own.

We should always seek to cooperate with others.

#### Attract

If you have the next great JS idea, we want to encourage and help you to build it as part of the DoneJS family.  You'll find DoneJS a supportive environment to nurture your ideas.  You can even pair with the full-time developers to build out your idea. Reach out to us on
[Slack](https://www.bitovi.com/community/slack) ([#donejs channel](https://bitovi-community.slack.com/messages/CFC80DU5B))
or create an issue.


## History

DoneJS’s history goes back for almost a decade!  Learn why JavaScriptMVC was started and how it evolved into DoneJS.

### Beginning Steps

We begin [our story](https://forum.javascriptmvc.com/topic/a-brief-history-of-javascriptmvc) in 2007 when Justin Meyer, the CEO of Bitovi, was working for Accenture. He had an idea to build something like [ZoHo Creator](https://creator.zoho.com/home), so you could set up REST services and use an online IDE to write JavaScript apps from those services — you could sell your apps and everything. He called it Scaffold.

He worked with Brian, a friend from college (who’s now the CTO of Bitovi). Brian quit graduate school so they could start working on it together. They worked on it for about a year and managed to sell it to a few places, but it never really took off. They then started building JavaScript tools for Scaffold to help people write their apps.

Their initial work was based off a library called [TrimPath](https://code.google.com/archive/p/trimpath/). It had templates, an MVC pattern, etc. They worked with Steve Yen for a little bit, but their client-only focus left them to split of trimpath/trimjunction into what they called JSJunction. Eventually, they didn’t like the name JSJunction and changed it to JavaScriptMVC.

In JavaScriptMVC’s first release, it had support for things such as:

- Model - View - Controller design pattern
- History & routing
- Templates
- Plugins for filtering, paginating, sorting, etc.

Even in JavaScriptMVC’s early days, Justin knew that [“developers need a repeatable way of building their applications and separating concerns.”](https://groups.google.com/forum/#!searchin/jquery-dev/jQuery$20enterprise/jquery-dev/HsTcpuAmFtY/mN4qFyHw54oJ) When a dev team can work with a standard set of tools and processes, their productivity can greatly increase.

FuncUnit and StealJS both started in 2010, and in 2012 we started splitting JavaScriptMVC into smaller, focused projects, including CanJS, jQuery++, DocumentJS, and DocumentCSS. Then, in 2015, we rebranded JavaScriptMVC to DoneJS and released it to the public.

### Tomorrow's Roadmap

The following are our highest priority, non-bug-fix features:

- [can-set support sort](https://github.com/canjs/can-set/pull/10)
- [documentjs configured in package.json](https://github.com/bitovi/documentjs/issues/202)
- [StealJS dependency injection](https://github.com/stealjs/steal/issues/509)
- [can-connect supporting other frameworks](https://github.com/canjs/can-connect/issues/42)
- [Animation utilities](https://github.com/canjs/can-animate)
- [O(log n) derived list modification](https://github.com/canjs/can-derive)
- [CanJS Roadmap Discussion](https://forums.bitovi.com/t/canjs-roadmap-discussion/75)

## Team

The DoneJS family of technologies is built by hundreds of contributors just like you! Our [contributing contribution guide] includes information about reporting bugs, finding ways to contribute, submitting new code, and more!

If you’d like to take your commitment to DoneJS or its sub-projects to the next level, you can join our core team. To become a part of the core team, you simply have to:

- [Email](mailto:contact@bitovi.com) the core team expressing your interest.
- Attend the weekly _DoneJS Contributors_ meeting twice a month. [DoneJS Calendar](https://www.google.com/calendar/embed?src=jupiterjs.com_g27vck36nifbnqrgkctkoanqb4%40group.calendar.google.com&ctz=America/Chicago)
- Make one small contribution, even a spelling correction, each month.

### Core team

The core team is made up of both part-time and full-time contributors.

<div class="core-team-member">
  <img class="member-avatar" src="https://avatars2.githubusercontent.com/u/2445805?v=3&s=400" alt="Kevin Dillon profile picture" />
  <h4>Kevin Dillon</h4>
  <p>
    Kevin is a senior infrastructure engineer at The MathWorks in the Web and Mobile Tools team.
    He focuses on the development of FuncUnit and Syn.
  </p>
  <a href="https://github.com/kdillon" target="_blank">GitHub</a>
</div>

<div class="core-team-member">
  <img class="member-avatar" src="https://avatars2.githubusercontent.com/u/10070176?v=3&s=400" alt="Chasen Le Hara profile picture" />
  <h4>Chasen Le Hara</h4>
  <p>
    Chasen is a 🍺 🏃 with a passion for building great web apps.
    He supports the DoneJS community by leading developer advocacy for DoneJS.
  </p>
  <a href="https://twitter.com/chasenlehara" target="_blank">@chasenlehara</a>
  <a href="https://github.com/chasenlehara" target="_blank">GitHub</a>
</div>

<div class="core-team-member">
<img class="member-avatar" src="https://avatars3.githubusercontent.com/u/4830283?v=3&s=300"/>
<h4>Prashant Sharma</h4>
<p>
Prashant is based in Bangalore, India. He likes the understated elegance of CanJS. He also believes DoneJS is a great framework in the making, since it makes technology selection a no-brainer by uniquely offering developers an all-in-one technology stack.
</p>
<a href="https://github.com/prashantsharmain" target="_blank">GitHub</a>
</div>

<div class="core-team-member">
<img class="member-avatar" src="https://lh3.googleusercontent.com/-UOTrK62q0fM/AAAAAAAAAAI/AAAAAAAAADc/1_BqFteAC4Y/s300-p-rw-no/photo.jpg"/>
<h4>Julian Kern</h4>
<p>
A 29 old guy from Germany, Julian started coding at the age of 16. Now he freelances with CanJS. He likes the clean structure of Model, Views, and ViewModels.
</p>
<a href="https://twitter.com/22_Solutions" target="_blank">@22_Solutions</a>
</div>

<div class="core-team-member">
<img class="member-avatar" src="https://avatars1.githubusercontent.com/u/109013?v=3&s=300"/>
<h4>Mohamed Cherif Bouchelaghem</h4>
<p>
Mohamed Cherif BOUCHELAGHEM from Algiers, Algeria, almost a server side developer in day work, JavaScript developer after work hours especially using DoneJS/CanJS. He likes to help people to learn and find solutions to issues with DoneJS framework and build applications and code samples that help to show the best from DoneJS/Canjs and learn it faster.
</p>
<a href="https://twitter.com/Cherif_b" target="_blank">@Cherif_b</a>
<a href="https://github.com/cherifGsoul" target="_blank">GitHub</a>

</div>


<div class="core-team-member">
<img class="member-avatar" src="https://avatars1.githubusercontent.com/u/5851984?v=3&s=300"/>
<h4>Kevin Phillips</h4>
<p>
Kevin is based in Chicago (well, close enough). He wants to make it easy for anyone to get started with DoneJS and will work on features that help solve complex problems.
</p>
<a href="https://twitter.com/kdotphil" target="_blank">@kdotphil</a>
<a href="https://github.com/phillipskevin" target="_blank">GitHub</a>

</div>

<div class="core-team-member">
<img class="member-avatar" src="https://avatars3.githubusercontent.com/u/78602?v=3&s=300"/>
<h4>Justin Meyer</h4>
<p>
Justin dances and plays basketball in Chicago. He created JavaScriptMVC and manages the
DoneJS project, and shouldn't code on it as much as he does.
</p>
<a href="https://twitter.com/justinbmeyer" target="_blank">@justinbmeyer</a>
<a href="https://github.com/justinbmeyer" target="_blank">GitHub</a>
</div>

<div class="core-team-member">
<img class="member-avatar" src="https://avatars3.githubusercontent.com/u/338316?v=3&s=300"/>
<h4>David Luecke</h4>
<p>
David is a Canadian by way of Germany. His focus is on CanJS and
DoneJS's testing stack.
</p>
<a href="https://twitter.com/daffl" target="_blank">@daffl</a>
<a href="https://github.com/daffl" target="_blank">GitHub</a>
</div>

<div class="core-team-member">
<img class="member-avatar" src="https://avatars2.githubusercontent.com/u/361671?v=3&s=300"/>
<h4>Matthew Phillips</h4>
<p>
Matthew, keeper of beards, is the lead maintainer of StealJS and its related tools.
</p>
<a href="https://twitter.com/matthewcp" target="_blank">@matthewcp</a>
<a href="https://github.com/matthewp" target="_blank">GitHub</a>
</div>


### Sponsors

If you'd like to support the development of DoneJS, please find available options on our [Patreon page](https://www.patreon.com/donejs).  If you have other ideas, or would like to customize your support,
please [email us](mailto:contact@bitovi.com).


[Bitovi](https://www.bitovi.com/), a JavaScript consulting company, is the primary sponsor of DoneJS.
