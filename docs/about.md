@page About
@parent DoneJS
@hide sidebar
@outline 2 ol

@description DoneJS goal is to help the JavaScript community make, and continue to make, amazing applications. Amazing applications are fast, highly usable, and
maintainable.  

But times change and new techniques emerge. We strive to adopt these
techniques, improve the stack, and provide a simple upgrade path along the way. 

We are part of a community that helps developers of all skill levels and 
backgrounds learn the technology, excell at it, and accomplish their
goals.

Learn about the goals, history, roadmap, and team behind DoneJS.

@body

## Goals



DoneJS has three primary goals:

1.  To enable developers to easily create high performance, maintainable, highly usable (amazing) applications.
2.  To continually evolve with new techniques and tools.
3.  To support the technology community.

### Amazing Applications

Building a modern application is increasingly difficult. There's 



There are many competing concerns to balance.

An amazing application needs to be fast, reach as many users as possible, and provide a great user experience.

It should also be maintainable, otherwise it will be too expensive in the long run.

And yet it needs to be done on time, making the previous requirements hard to fit in.

DoneJS aims to guide developers down a yellow brick road towards a successful JavaScript application: making every step towards an amazing application well lit and simple.

Our goal is to make it hard to NOT make an amazing application using DoneJS.

We aim to do this in three main ways:

1. Providing a full, integrated solution: literally everything you need to build a complex app.
1. Solving hard technical problems.
2. Providing tools that eliminate any barrier to "doing the right thing"

#### 1. Full stack

For any sufficiently complex application, there are many many layers of foundation needed. 

The rise of [micro-libraries](http://microjs.com/#), small single-purpose modules, has led to a time when picking your stack involves choosing from thousands of potential options, and infinite possible combinations that have to work together well.

So many options sounds good in theory. In practice, we've found it presents more challenges than benefits.

How do you choose? How do you know if they fit well together? How do you find support for your unique combination of tools?

Most importantly, who has time for that?

DoneJS gives you a full solution: literally everything you need to build a complex app, working together seamlessly. Its our mission to eliminate any ambiguity around choosing technology for building an app, so you can spend time actually building your app. 

We've compiled best in class tools for every part of the JavaScript application lifecycle: from tooling, to application architecture, to production deployment.

Just like Apple owning the whole stack from software to hardware makes for a great experience: the whole DoneJS stack is greater than the sum of its parts. 

A few examples:

* Generators span layers by helping bootstrap an entire projects or individual modules.
* `<can-import>` brings dependency management into templates and hooks that simplify progressive loading - spanning several projects.
* Server side rendering is made simple through the use of hooks within data components that tell the server to delay rendering - a feature that bridges can-connect, StealJS, and can-ssr.

#### 2. Hard technical problems

DoneJS aims to identify the hard parts of front-end development, and solve them, or at least make them as simple for developers as possible.

A few examples:

- Server Side Rendering
- Automatic real-time updates
- Builds to mobile and desktop
- Optimal builds deployed to a CDN

#### 3. Doing the right thing

To us, the `right thing` means doing the extra work that makes your code easier to debug and maintain: things like tests, docs, continuous integration, and deployment automation.

Often, there is a barrier to doing the right thing: finding the right tools, learning about them, setting up, and configuring them. DoneJS aims to remove this barrier, making doing the `right thing` simply part of the normal dev cycle.

A few examples:

- Tests
- Documentation
- Guides for CI and CD
- Modlets
- Generators

### Evolve

Technology is always a moving target. If you follow the JavaScript JavaScript community, you'll know that the past 10 years have been a whirlwind of activity: evolving best practices, frameworks coming and going, browsers adding features.

Our goal is to embrace the change. Our promise to DoneJS users is that we'll continue to evolve, while always providing an upgrade path.

Applications often live for many years. Therefore, framework longevity is a critical ingredient, maybe THE critical ingredient, in project success. 

If you pick a framework that abandons its users or stagnates, you'll be spending far too much time on rewrites or inefficient patterns that are solved in other frameworks.

<img src="/static/img/evolve/badframework.png"  alt="Bad framework choice can kill long term velocity" />

If you pick a framework that continues to innovate, your app lives long and prospers.

<img src="/static/img/evolve/goodframework.png" alt="Good framework choice helps maintain increasing velocity" />

It's far too easy to be seduced by the allure of popularity. But popularity doesn't predict longevity.

<img src="/static/img/evolve/toohot.jpg" alt="Good framework choice helps maintain increasing velocity" />

Many "hot" frameworks, even those backed by giant corporations, fizzle out.

<img src="/static/img/evolve/graveyard.png" alt="Many frameworks fizzle out" />

The only true predictor of framework longevity is past behavior. 

DoneJS is the next generation of a long line of tools that have a long track record of continuous innovation (more on that story in the History section). Here are some highlights:

<iframe src='https://cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=1lBdurIQbbJkTZ8_kCQaXZtFaD06ulMFAlkqyEmXH4k0&font=Bevan-PotanoSans&maptype=toner&lang=en&start_at_slide=3&height=650&start_zoom_adjust=-2' width='100%' height='650' frameborder='0'></iframe> 

Steady, consistent improvements since 2007, all while providing an upgrade path along the way. If your project chose JavaScriptMVC in 2007, you would have made a wise decision, giving your team an upgrade path to a modern application for the past 8.5 years.

<img src="/static/img/evolve/bitovitech.png" alt="A graph showing Bitovi's continued releases" />

Our goal is to provide steady progress into the future. DoneJS will keep evolving with the times.

### Community

 - Teach - Our tech is worth nothing if people don't know how to use it.  We have a weekly training, and post
   training videos.  We also have "free" single trainings anywhere people can assemble 10 people.  If you'd
   like a free DoneJS training please email. Our full time team is always available to chat on gitter.
   
 - Explore - DoneJS's parts should work with everything.  StealJS works great with ReactJS.  CanJS works
   with RequireJS or Browserify.  can-connect works on its own.  Different combinations suite people differently.  
   Our goal is to enhance other communities with DoneJS's technology.
   
 - Attract - If you have the next great JS idea, we want to encourage you to help build it as part of the DoneJS
   family.  You'll find DoneJS a supportive environment to nurture your ideas.  You can even pair with the full
   time devs to build out your idea.


## History

DoneJS's history goes back more than 8 years!  Learn why JavaScriptMVC was started, and how it
evolved into DoneJS.

### Beginning Insipration

Brian and Justin were trying to make something like Filemaker pro, but for the web. They
were young and stupid.  To make something so complex, as a SPA, they need things like:

- Templates
- A build system
- Event delegation
- A model
- Testing

### Middle Challenges

Maintaining all these projects was too much. And it was a big pill to swallow. So we started to break out our tech.

And, these projects were based on Rhino, not node.  So we set out to update EVERYTHING and
solve some of the biggest remaining struggles - real-time, ssr, different builds.


### Today's Effort

After releasing DoneJS, our team will be almost exclusively focused on 
DoneJS's community, training, and documentation. DoneJS is amazing, but without getting
people the skills they need to effecitvely use it, it will go to waste.

- How can people get involved?
- 

### Tomorrow's Roadmap

- StealJS's dependency injection
- DirtyChecking 
- can-connect supporting other frameworks
- Other MV*\ support?
- Animation utilities

## Team

The DoneJS family of technologies is built by 100s of contributors:


### Core team

To become a contributor to DoneJS or its sub-projects, you simply have to:

- email the core team expressing your interest.
- attend a monthly meeting
- make one small contribution, even a spelling correction, a month.

### Fulltime team

 - David
 - Matthew
 - Justin

### Bitovi

Bitovi, a JavaScript consulting company, is the primary sponsor of DoneJS. If you would
like to sponsor development, please contact.


